# HRMate AI — Agentic HR Employee Operations (Groq)

A portfolio-ready MVP for an **AI + Full-Stack Engineering / Agentic AI** internship.

HRMate AI is an AI-powered HR employee operations platform that uses an LLM agent, database tools, RAG-based HR policy search, REST APIs, and a React dashboard.

The application supports employee information, leave balance, leave history, HR policy questions, and leave request workflows with a human-approval boundary.

## Why Groq?

This version uses the **Groq API** for fast LLM inference.

The agent uses Groq tool/function calling:

1. User sends a request.
2. The AI agent understands the request.
3. The agent selects the required HR tool.
4. FastAPI executes the tool.
5. The tool retrieves or updates application data.
6. The result is returned to the agent.
7. The agent generates the final response.

The project currently uses:

`openai/gpt-oss-120b`

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI + Python
- Agent: Groq + tool/function calling
- Database: SQLite + SQLAlchemy
- RAG: ChromaDB
- Vector Search: Local/default embeddings
- Testing: pytest
- API Documentation: FastAPI Swagger
- Deployment: Docker

## Main Features

- Employee information
- Employee-specific leave balance
- Sick and casual leave tracking
- Leave history
- HR policy Q&A using RAG
- Leave date validation
- Leave request creation
- Pending leave approval workflow
- AI agent with backend tools
- Employee switching for testing
- React-based HR dashboard
- Quick HR actions
- Human-in-the-loop workflow

## Agent Tools

The HR agent can use dedicated tools for:

- `get_employee_info()`
- `get_leave_balance()`
- `search_hr_policy()`
- `check_leave_dates()`
- `create_leave_request()`
- `list_leave_requests()`

## How the Agent Works

Example:

User:

`How many casual leaves do I have?`

Workflow:

User Request  
↓  
HRMate AI Agent  
↓  
`get_leave_balance()`  
↓  
SQLite Database  
↓  
Leave Balance  
↓  
AI Agent  
↓  
Final Response

Another example:

User:

`What is the WFH policy?`

Workflow:

User Request  
↓  
HRMate AI Agent  
↓  
`search_hr_policy()`  
↓  
ChromaDB / RAG  
↓  
Relevant HR Policy  
↓  
AI Agent  
↓  
Final Response

## Leave Request Workflow

Example:

`I want leave from 2026-09-20 to 2026-09-22 for a family event`

Workflow:

User Request  
↓  
Check Employee  
↓  
Check Leave Balance  
↓  
Validate Leave Dates  
↓  
Create Leave Request  
↓  
PENDING  
↓  
Human / Manager Approval

Leave requests are created as **PENDING** and are not automatically approved.

## RAG Policy Search

HRMate AI uses Retrieval-Augmented Generation for HR policy questions.

HR Policy Document  
↓  
Document Processing  
↓  
Embeddings  
↓  
ChromaDB  
↓  
Semantic Search  
↓  
Relevant Policy Content  
↓  
Groq LLM  
↓  
Grounded HR Response

## Project Architecture

React Frontend  
↓  
FastAPI REST API  
↓  
HRMate AI Agent  
↓  
Groq LLM  
↓  
HR Tools  
↓  
SQLite / ChromaDB  
↓  
Final Response

## Run Backend

```powershell
cd backend

python -m venv .venv
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt

## Run Backend

Open PowerShell:

```powershell
cd backend

uv sync
uv run python -m app.main

The backend will run at:

http://127.0.0.1:8000

cd frontend

npm install
npm run dev

Demo Database

HRMate AI automatically creates and seeds the demo SQLite database when the backend starts.

Database:

backend/hrmate.db

Demo Employees
| Employee ID | Name         | Department  | Casual Leave | Sick Leave |
| ----------- | ------------ | ----------- | -----------: | ---------: |
| 1001        | Rahul Kumar  | Engineering |            8 |          6 |
| 1002        | Priya Sharma | HR          |           10 |          5 |
| 1003        | Aman Singh   | Sales       |            6 |          7 |
| 1004        | Neha Verma   | Finance     |           12 |          4 |
| 1005        | Rohan Gupta  | Operations  |            7 |          8 |

Demo Queries

Select an employee from the employee dropdown and try:

Show my employee information
How many casual leaves do I have?
How many sick leaves do I have?
What is the WFH policy?
Show my leave history
I want leave from 2026-09-20 to 2026-09-22 for a family event
