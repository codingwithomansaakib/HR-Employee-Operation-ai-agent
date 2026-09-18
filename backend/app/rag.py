from pathlib import Path
import chromadb

DOCS_DIR = Path(__file__).resolve().parents[1] / "documents"
CHROMA_DIR = Path(__file__).resolve().parents[1] / "chroma_db"

_client = chromadb.PersistentClient(path=str(CHROMA_DIR))
_collection = _client.get_or_create_collection("hr_policies")

def seed_policies():
    docs = list(DOCS_DIR.glob("*.txt"))
    if not docs:
        return
    existing = _collection.count()
    if existing:
        return
    for i, path in enumerate(docs):
        text = path.read_text(encoding="utf-8")
        _collection.add(ids=[str(i)], documents=[text], metadatas=[{"source": path.name}])

def search_policy(query: str, k: int = 3) -> str:
    seed_policies()
    if _collection.count() == 0:
        return "No HR policy documents are available."
    result = _collection.query(query_texts=[query], n_results=min(k, _collection.count()))
    docs = result.get("documents", [[]])[0]
    return "\n\n".join(docs) if docs else "No matching HR policy found."
