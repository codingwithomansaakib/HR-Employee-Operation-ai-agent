from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine, SessionLocal
from .models import Employee, LeaveBalance
from .api import router
from .rag import seed_policies

app = FastAPI(title="HRMate AI - Groq Agentic HR Operations")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def seed_demo_data():
    db = SessionLocal()

    employees = [
        Employee(
            id=1001,
            name="Rahul Kumar",
            email="rahul@test.com",
            department="Engineering"
        ),
        Employee(
            id=1002,
            name="Priya Sharma",
            email="priya@test.com",
            department="HR"
        ),
        Employee(
            id=1003,
            name="Aman Singh",
            email="aman@test.com",
            department="Sales"
        ),
        Employee(
            id=1004,
            name="Neha Verma",
            email="neha@test.com",
            department="Finance"
        ),
        Employee(
            id=1005,
            name="Rohan Gupta",
            email="rohan@test.com",
            department="Operations"
        ),
    ]

    # Add employees
    for employee in employees:
        existing = db.query(Employee).filter(
            Employee.id == employee.id
        ).first()

        if not existing:
            db.add(employee)

    db.commit()

    # Add leave balances
    leave_data = [
        (1001, "casual", 8),
        (1001, "sick", 6),

        (1002, "casual", 10),
        (1002, "sick", 5),

        (1003, "casual", 6),
        (1003, "sick", 7),

        (1004, "casual", 12),
        (1004, "sick", 4),

        (1005, "casual", 7),
        (1005, "sick", 8),
    ]

    for employee_id, leave_type, balance in leave_data:

        existing = db.query(LeaveBalance).filter(
            LeaveBalance.employee_id == employee_id,
            LeaveBalance.leave_type == leave_type
        ).first()

        if not existing:
            db.add(
                LeaveBalance(
                    employee_id=employee_id,
                    leave_type=leave_type,
                    balance=balance
                )
            )

    db.commit()
    db.close()


seed_demo_data()


try:
    seed_policies()
except Exception:
    pass


app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "HRMate AI is running",
        "docs": "/docs",
        "model": "Groq / "
        + __import__(
            "app.config",
            fromlist=["GROQ_MODEL"]
        ).GROQ_MODEL
    }
