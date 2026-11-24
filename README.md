# Quote Generator with History

A full-stack random quote generator using Python Flask, the DummyJSON external quotes API, SQLite, HTML, CSS, and JavaScript.

## Features
- Fetches a random quote and author from an external API.
- Sends the API request through the Flask backend.
- Saves every successfully generated quote in an SQLite database.
- Displays saved quotes in newest-first order with timestamps.
- Loads saved history when the page opens and supports refreshing it.
- Handles API/network errors with a user-friendly message.

## Run in VS Code (Windows PowerShell)
```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

An internet connection is required to fetch new quotes from the external API.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/quotes/random` | Fetch a random quote and save it |
| GET | `/api/quotes/history` | Retrieve saved quote history |

## External API
`https://dummyjson.com/quotes/random`

The SQLite database `quotes_history.db` is created automatically when the app starts.
