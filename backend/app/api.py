from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .database import get_db
from .schemas import ChatRequest, LeaveRequestCreate
from .agent import run_agent
from .tools import list_leave_requests, get_employee_info, get_leave_balance

router = APIRouter(prefix="/api")

@router.get("/health")
def health():
    return {"status": "ok"}

@router.post("/chat")
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    return run_agent(db, payload.employee_id, payload.message)

@router.get("/employee/{employee_id}")
def employee(employee_id: int, db: Session = Depends(get_db)):
    return get_employee_info(db, employee_id)

@router.get("/leave-balance/{employee_id}")
def leave_balance(employee_id: int, db: Session = Depends(get_db)):
    return get_leave_balance(db, employee_id)

@router.get("/leave-history/{employee_id}")
def leave_history(employee_id: int, db: Session = Depends(get_db)):
    return list_leave_requests(db, employee_id)

@router.post("/leave-request")
def leave_request(payload: LeaveRequestCreate, db: Session = Depends(get_db)):
    from .tools import create_leave_request
    return create_leave_request(db, payload.employee_id, str(payload.start_date), str(payload.end_date), payload.reason)
