from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from .database import Base

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    department = Column(String, nullable=False)

class LeaveBalance(Base):
    __tablename__ = "leave_balances"
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type = Column(String, nullable=False, default="casual")
    balance = Column(Integer, nullable=False, default=12)

class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(Text, default="")
    status = Column(String, default="PENDING")
