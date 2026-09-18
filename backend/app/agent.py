import json
from groq import Groq
from .config import GROQ_API_KEY, GROQ_MODEL
from .tools import (
    get_employee_info, get_leave_balance, check_leave_dates,
    create_leave_request, list_leave_requests
)
from .rag import search_policy

client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

SYSTEM_PROMPT = """You are HRMate, an HR Employee Operations Agent.
Help employees with employee information, leave balances, HR policy questions, leave history,
and leave requests. Use tools whenever current database or policy information is needed.
Never invent employee or leave data. Leave requests must remain PENDING until human/manager approval.
Be concise and explain what action was taken."""

TOOLS = [
    {"type": "function", "function": {
        "name": "get_employee_info",
        "description": "Get employee profile information.",
        "parameters": {"type": "object", "properties": {"employee_id": {"type": "integer"}}, "required": ["employee_id"]}
    }},
    {"type": "function", "function": {
        "name": "get_leave_balance",
        "description": "Get the employee's leave balance.",
        "parameters": {"type": "object", "properties": {
            "employee_id": {"type": "integer"},
            "leave_type": {"type": "string", "default": "casual"}
        }, "required": ["employee_id"]}
    }},
    {"type": "function", "function": {
        "name": "search_hr_policy",
        "description": "Search internal HR policy documents.",
        "parameters": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}
    }},
    {"type": "function", "function": {
        "name": "check_leave_dates",
        "description": "Validate leave dates and calculate requested days.",
        "parameters": {"type": "object", "properties": {
            "start_date": {"type": "string"},
            "end_date": {"type": "string"}
        }, "required": ["start_date", "end_date"]}
    }},
    {"type": "function", "function": {
        "name": "create_leave_request",
        "description": "Create a PENDING leave request after validating dates.",
        "parameters": {"type": "object", "properties": {
            "employee_id": {"type": "integer"},
            "start_date": {"type": "string"},
            "end_date": {"type": "string"},
            "reason": {"type": "string"}
        }, "required": ["employee_id", "start_date", "end_date"]}
    }},
    {"type": "function", "function": {
        "name": "list_leave_requests",
        "description": "List an employee's leave request history.",
        "parameters": {"type": "object", "properties": {"employee_id": {"type": "integer"}}, "required": ["employee_id"]}
    }},
]

def run_agent(db, employee_id: int, user_message: str):
    if not client:
        return {"answer": "Groq API key is missing. Add GROQ_API_KEY to backend/.env and try again.", "mode": "setup"}

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Employee ID: {employee_id}\nRequest: {user_message}"}
    ]

    for _ in range(5):
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
            temperature=0.1,
        )
        msg = response.choices[0].message

        if not msg.tool_calls:
            return {"answer": msg.content or "No response generated.", "mode": "groq-agent"}

        tool_calls = []
        for call in msg.tool_calls:
            tool_calls.append({
                "id": call.id,
                "type": "function",
                "function": {"name": call.function.name, "arguments": call.function.arguments}
            })
        messages.append({
            "role": "assistant",
            "content": msg.content or "",
            "tool_calls": tool_calls
        })

        for call in msg.tool_calls:
            name = call.function.name
            args = json.loads(call.function.arguments or "{}")
            if name == "get_employee_info":
                result = get_employee_info(db, employee_id)
            elif name == "get_leave_balance":
                result = get_leave_balance(db, employee_id, args.get("leave_type", "casual"))
            elif name == "search_hr_policy":
                result = search_policy(args.get("query", user_message))
            elif name == "check_leave_dates":
                result = check_leave_dates(args["start_date"], args["end_date"])
            elif name == "create_leave_request":
                result = create_leave_request(
                    db, employee_id, args["start_date"], args["end_date"], args.get("reason", "")
                )
            elif name == "list_leave_requests":
                result = list_leave_requests(db, employee_id)
            else:
                result = {"error": f"Unknown tool: {name}"}

            messages.append({
                "role": "tool",
                "tool_call_id": call.id,
                "name": name,
                "content": json.dumps(result, default=str)
            })

    return {"answer": "The agent reached its tool-call limit. Please try the request again.", "mode": "groq-agent"}
