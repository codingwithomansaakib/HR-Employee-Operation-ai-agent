import os
from pathlib import Path
from dotenv import load_dotenv

# Find backend folder
BASE_DIR = Path(__file__).resolve().parents[1]

# Explicitly load backend/.env
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()

GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-120b"
)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./hrmate.db"
)

print("\n==============================")
print("HRMate AI Configuration")
print("==============================")
print("ENV FILE:", ENV_FILE)
print("GROQ KEY LOADED:", bool(GROQ_API_KEY))
print("GROQ MODEL:", GROQ_MODEL)
print("==============================\n")
