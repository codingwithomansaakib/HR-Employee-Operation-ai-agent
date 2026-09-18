# HRMate AI — Agentic HR Employee Operations (Groq)

A portfolio-ready MVP for an **AI + Full-Stack Engineering / Agentic AI** internship.  
The app demonstrates an HR department use case with an LLM agent, database tools, RAG policy search, REST APIs, React UI, tests, and a human-approval boundary for leave requests.

## Why Groq?

This version uses the **Groq API** instead of OpenAI. Groq offers a free tier with rate/usage limits, so it can be useful for development without OpenAI API charges. It is **not unlimited free API access**.

The agent uses Groq tool/function calling:
1. User asks a question.
2. Groq decides whether a tool is needed.
3. FastAPI executes the local tool.
4. Tool result is returned to Groq.
5. Groq produces the final response.

## Tech stack

- Frontend: React + Vite
- Backend: FastAPI + Python
- Agent: Groq + tool/function calling
- Database: SQLite + SQLAlchemy
- RAG: ChromaDB using local/default embeddings
- Testing: pytest
- API docs: FastAPI Swagger at `/docs`

## Run backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Open `.env` and add your Groq API key:

```env
GROQ_API_KEY=your_real_key
GROQ_MODEL=llama-3.3-70b-versatile
DATABASE_URL=sqlite:///./hrmate.db
```

Then:

```powershell
uvicorn app.main:app --reload
```

Open:
- http://127.0.0.1:8000
- http://127.0.0.1:8000/docs

## Run frontend

```powershell
cd frontend
npm install
npm run dev
```

Vite will show the local frontend URL.

## Demo employee

Employee ID: `1`

Try:
- `How many casual leaves do I have?`
- `What is the WFH policy?`
- `Show my leave history`
- `I want leave from 2026-09-20 to 2026-09-22 for a family event`

Leave requests are created as `PENDING`; the demo does not automatically approve them.

## Tests

From `backend`:

```powershell
pytest
```

## AIONOS-style interview explanation

**Problem:** HR teams repeatedly answer employee policy and leave questions.

**Agentic solution:** HRMate uses an LLM agent that can choose tools for live employee data, leave balance/history, policy retrieval, date validation, and leave-request creation.

**Architecture:** React → FastAPI → Groq Agent → Tools → SQLite / ChromaDB → response.

**Important engineering point:** The LLM does not directly change approval status. A leave request remains `PENDING`, preserving a human/manager approval step.

## Production upgrades

For a real organization, add authentication/RBAC, PostgreSQL, strict CORS, audit logs, encrypted secrets, policy versioning, approval notifications, observability, CI/CD, evaluation datasets, rate limiting, and deployment.
