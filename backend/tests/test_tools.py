from datetime import date
from app.tools import check_leave_dates

def test_leave_dates():
    result = check_leave_dates("2026-09-20", "2026-09-22")
    assert result["valid"] is True
    assert result["days"] == 3

def test_invalid_dates():
    result = check_leave_dates("2026-09-25", "2026-09-20")
    assert result["valid"] is False
