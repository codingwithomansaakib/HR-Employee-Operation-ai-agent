from datetime import date
from sqlalchemy.orm import Session
from .models import Employee, LeaveBalance, LeaveRequest
from .rag import search_policy

def get_employee_info(db: Session, employee_id: int):
    e = db.get(Employee, employee_id)
    if not e:
        return {"error": "Employee not found"}
    return {"id": e.id, "name": e.name, "email": e.email, "department": e.department}

def get_leave_balance(db: Session, employee_id: int, leave_type: str = "casual"):
    row = (
        db.query(LeaveBalance)
        .filter(LeaveBalance.employee_id == employee_id, LeaveBalance.leave_type == leave_type)
        .first()
    )
    return {"employee_id": employee_id, "leave_type": leave_type, "balance": row.balance if row else 0}

def check_leave_dates(start_date: str, end_date: str):
    try:
        start = date.fromisoformat(start_date)
        end = date.fromisoformat(end_date)
    except ValueError:
        return {"valid": False, "error": "Dates must use YYYY-MM-DD format."}
    if end < start:
        return {"valid": False, "error": "End date cannot be before start date."}
    days = (end - start).days + 1
    return {"valid": True, "start_date": start_date, "end_date": end_date, "days": days}

def create_leave_request(db: Session, employee_id: int, start_date: str, end_date: str, reason: str = ""):
    checked = check_leave_dates(start_date, end_date)
    if not checked.get("valid"):
        return checked
    req = LeaveRequest(
        employee_id=employee_id,
        start_date=date.fromisoformat(start_date),
        end_date=date.fromisoformat(end_date),
        reason=reason,
        status="PENDING",
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return {
        "request_id": req.id,
        "employee_id": employee_id,
        "days": checked["days"],
        "status": req.status,
        "message": "Leave request created and is pending human/manager approval."
    }

def list_leave_requests(db: Session, employee_id: int):
    rows = db.query(LeaveRequest).filter(LeaveRequest.employee_id == employee_id).order_by(LeaveRequest.id.desc()).all()
    return [
        {"id": r.id, "start_date": str(r.start_date), "end_date": str(r.end_date), "reason": r.reason, "status": r.status}
        for r in rows
    ]
