from datetime import date
from pydantic import BaseModel

class ChatRequest(BaseModel):
    employee_id: int
    message: str

class LeaveRequestCreate(BaseModel):
    employee_id: int
    start_date: date
    end_date: date
    reason: str = ""

class LeaveRequestOut(BaseModel):
    id: int
    employee_id: int
    start_date: date
    end_date: date
    reason: str
    status: str

    class Config:
        from_attributes = True
