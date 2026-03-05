from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect("scores.db")
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            score INTEGER
        )
    """)
    conn.commit()
    conn.close()

@app.route("/submit", methods=["POST"])
def submit():
    data = request.json
    name = data["name"]
    score = int(data["score"])

    conn = sqlite3.connect("scores.db")
    c = conn.cursor()
    c.execute("INSERT INTO scores (name, score) VALUES (?,?)", (name, score))
    conn.commit()
    conn.close()

    return jsonify({"status": "success"})

@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    conn = sqlite3.connect("scores.db")
    c = conn.cursor()
    c.execute("SELECT name, score FROM scores ORDER BY score DESC LIMIT 10")
    rows = c.fetchall()
    conn.close()

    return jsonify([{"name": r[0], "score": r[1]} for r in rows])

if __name__ == "__main__":
    init_db()
    app.run()
