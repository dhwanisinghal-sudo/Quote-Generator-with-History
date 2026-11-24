from flask import Flask, render_template, jsonify
import sqlite3
from pathlib import Path
from datetime import datetime, timezone
import requests

app = Flask(__name__)
DB_PATH = Path(__file__).with_name("quotes_history.db")
QUOTE_API = "https://dummyjson.com/quotes/random"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS quote_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quote TEXT NOT NULL,
            author TEXT NOT NULL,
            created_at TEXT NOT NULL
        )""")

@app.route("/")
def home():
    return render_template("index.html")

@app.post("/api/quotes/random")
def generate_quote():
    try:
        response = requests.get(QUOTE_API, timeout=10)
        response.raise_for_status()
        data = response.json()
        quote = (data.get("quote") or "").strip()
        author = (data.get("author") or "Unknown").strip()
        if not quote:
            return jsonify({"error": "The quote service returned an empty quote. Please try again."}), 502
        created_at = datetime.now(timezone.utc).astimezone().strftime("%d %b %Y, %I:%M %p")
        with get_db() as conn:
            cursor = conn.execute(
                "INSERT INTO quote_history (quote, author, created_at) VALUES (?, ?, ?)",
                (quote, author, created_at)
            )
            quote_id = cursor.lastrowid
        return jsonify({"id": quote_id, "quote": quote, "author": author, "created_at": created_at})
    except requests.RequestException:
        return jsonify({"error": "Could not connect to the quote API. Check your internet connection and try again."}), 502
    except (ValueError, KeyError):
        return jsonify({"error": "The quote service returned an unexpected response. Please try again."}), 502

@app.get("/api/quotes/history")
def quote_history():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, quote, author, created_at FROM quote_history ORDER BY id DESC"
        ).fetchall()
    return jsonify([dict(row) for row in rows])

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
