from flask import Flask, request, jsonify
import numpy as np   # ✅ ADD THIS
import joblib
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")
# -------------------------
# CREATE DATABASE
# -------------------------
def init_db():
    conn = sqlite3.connect("patients.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        mobile TEXT,
        password TEXT
    )
    """)

    conn.commit()
    conn.close()

init_db()

# -------------------------
# REGISTER
# -------------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    name = data["name"]
    email = data["email"]
    mobile = data["mobile"]
    password = data["password"]

    conn = sqlite3.connect("patients.db")
    cursor = conn.cursor()

    try:
        cursor.execute("""
        INSERT INTO users (name, email, mobile, password)
        VALUES (?, ?, ?, ?)
        """, (name, email, mobile, password))

        conn.commit()
        return jsonify({"message": "Registered Successfully"})

    except:
        return jsonify({"message": "Email already registered, please login"})

    finally:
        conn.close()

# -------------------------
# LOGIN
# -------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data["email"]
    password = data["password"]

    conn = sqlite3.connect("patients.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT id, name, mobile FROM users 
    WHERE email=? AND password=?
    """, (email, password))

    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({
            "status": "success",
            "user": {
                "id": user[0],
                "name": user[1],
                "mobile": user[2]
            }
        })
    else:
        return jsonify({"status": "fail", "message": "Invalid credentials"})
    

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        print("Received:", data)

        import numpy as np   # ✅ ensure inside also

        features = np.array(data, dtype=float).reshape(1, -1)
        print("Shape:", features.shape)

        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]

        result = "Malignant" if prediction == 1 else "Benign"

        return jsonify({"prediction": result})

    except Exception as e:
        print("FULL ERROR:", str(e))   # 🔥 IMPORTANT
        return jsonify({"error": str(e)})



# -------------------------
# RUN
# -------------------------
if __name__ == "__main__":
    app.run(debug=True)