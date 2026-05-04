from flask import Flask, request, jsonify, send_file
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from flask_cors import CORS
import numpy as np
import joblib
import sqlite3
import uuid
import os

app = Flask(__name__)
CORS(app)

# =========================
# LOAD MODEL
# =========================
model = joblib.load("../../model.pkl")
scaler = joblib.load("../../scaler.pkl")

# =========================
# DB INIT
# =========================
def init_db():
    conn = sqlite3.connect("patient.db")
    cursor = conn.cursor()

    # USERS TABLE (IMPORTANT ADD)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT,
        staffId TEXT UNIQUE,
        name TEXT,
        email TEXT UNIQUE,
        mobile TEXT,
        password TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientName TEXT,
        age TEXT,
        email TEXT,
        mobile TEXT,
        address TEXT,
        date TEXT,
        doctorName TEXT,
        doctorRole TEXT,
        radius REAL,
        texture REAL,
        perimeter REAL,
        area REAL,
        smoothness REAL,
        concavity REAL,
        result TEXT,
        pdfPath TEXT
    )
    """)

    conn.commit()
    conn.close()

init_db()

# ------------------------- # REGISTER 
# -------------------------
@app.route("/register", methods=["POST"]) 
def register(): 
    data = request.json 
    role = data.get("role") 
    staffId = data.get("staffId") # patient ke liye optional 
    name = data.get("name") 
    email = data.get("email") 
    mobile = data.get("mobile") 
    password = data.get("password") 
    
    # Validation 
    if not role or not name or not email or not mobile or not password: 
        return jsonify({ "message": "All fields are required" }) 
    conn = sqlite3.connect("patient.db") 
    cursor = conn.cursor() 
    try:
         cursor.execute(""" INSERT INTO users (role, staffId, name, email, mobile, password)
                         VALUES (?, ?, ?, ?, ?, ?) """, 
                         ( role, staffId, name, email, mobile, password )) 
         conn.commit() 
         return jsonify({ "message": "Registered Successfully" }) 
    except: 
        return jsonify({ "message": "Email or ID already exists, please login" })
        
    finally: 
        conn.close() 

# ------------------------- 
# LOGIN (EMAIL OR ID BASED) 
# ------------------------- 
@app.route("/login", methods=["POST"]) 
def login(): 
    data = request.json 
    loginId = data.get("loginId") # Email ya Staff ID 
    password = data.get("password") 
    if not loginId or not password: 
        return jsonify({ "status": "fail",
                         "message": "Please enter Email/ID and Password" })
        
    conn = sqlite3.connect("patient.db")
    cursor = conn.cursor() 
    cursor.execute(""" SELECT id, role, name, mobile FROM users WHERE (staffId = ? OR email = ?) AND password = ? """, (loginId, loginId, password)) 
    user = cursor.fetchone() 
    conn.close() 
    if user: 
        return jsonify({ "status": "success", "user": { "id": user[0], "role": user[1], "name": user[2], "mobile": user[3] } }) 
    return jsonify({ "status": "fail",
                     "message": "Invalid Email/ID or Password" })


# =========================
# FORGOT PASSWORD
# =========================
@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json

    conn = sqlite3.connect("patient.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email=?", (data["email"],))
    user = cursor.fetchone()

    if not user:
        return jsonify({"status": "fail", "message": "User not found"})

    cursor.execute(
        "UPDATE users SET password=? WHERE email=?",
        (data["newPassword"], data["email"])
    )

    conn.commit()
    conn.close()

    return jsonify({"status": "success", "message": "Password updated"})

def generate_pdf(data, result):
    os.makedirs("reports", exist_ok=True)

    file_path = f"reports/{str(uuid.uuid4())[:8]}.pdf"

    doc = SimpleDocTemplate(file_path, pagesize=A4)
    styles = getSampleStyleSheet()
    content = []

    # ===== TITLE =====
    content.append(Paragraph("<b>BREAST CANCER DETECTION REPORT</b>", styles["Title"]))
    content.append(Spacer(1, 20))

    # ===== PATIENT INFO =====
    content.append(Paragraph("<b>Patient Information</b>", styles["Heading2"]))
    content.append(Spacer(1, 10))

    patient_data = [
        ["Patient Name", data["patientName"]],
        ["Age", data["age"]],
        ["Email", data["email"]],
        ["Mobile", data["mobile"]],
        ["Address", data["address"]],
        ["Date", data["date"]],
    ]

    table = Table(patient_data, colWidths=[150, 300])
    table.setStyle(TableStyle([
        ("GRID", (0,0), (-1,-1), 1, colors.black),
        ("BACKGROUND", (0,0), (0,-1), colors.lightgrey),
    ]))

    content.append(table)
    content.append(Spacer(1, 20))

    # ===== DOCTOR INFO =====
    content.append(Paragraph("<b>Medical Staff Information</b>", styles["Heading2"]))
    content.append(Spacer(1, 10))

    doctor_data = [
        ["Doctor Name", data["doctorName"]],
        ["Doctor Role", data["doctorRole"]],
    ]

    table = Table(doctor_data, colWidths=[150, 300])
    table.setStyle(TableStyle([
        ("GRID", (0,0), (-1,-1), 1, colors.black),
        ("BACKGROUND", (0,0), (0,-1), colors.lightgrey),
    ]))

    content.append(table)
    content.append(Spacer(1, 20))

    # ===== FEATURES =====
    content.append(Paragraph("<b>Tumor Clinical Features</b>", styles["Heading2"]))
    content.append(Spacer(1, 10))

    features = data["features"]

    feature_data = [
        ["Radius", features[0]],
        ["Texture", features[1]],
        ["Perimeter", features[2]],
        ["Area", features[3]],
        ["Smoothness", features[4]],
        ["Concavity", features[5]],
    ]

    table = Table(feature_data, colWidths=[150, 300])
    table.setStyle(TableStyle([
        ("GRID", (0,0), (-1,-1), 1, colors.black),
        ("BACKGROUND", (0,0), (0,-1), colors.lightgrey),
    ]))

    content.append(table)
    content.append(Spacer(1, 20))

    # ===== RESULT =====
    content.append(Paragraph("<b>Final Diagnosis</b>", styles["Heading2"]))
    content.append(Spacer(1, 10))

    content.append(Paragraph(f"<b>Prediction Result:</b> {result}", styles["Normal"]))
    content.append(Spacer(1, 15))

    # ===== RECOMMENDATION =====
    content.append(Paragraph("<b>Medical Recommendation</b>", styles["Heading2"]))
    content.append(Spacer(1, 10))

    if result == "Malignant":
        content.append(Paragraph(
            "Immediate consultation with an oncologist is strongly recommended. "
            "Further clinical examination, biopsy, and specialist treatment should be considered as early as possible.",
            styles["Normal"]
        ))
    else:
        content.append(Paragraph(
            "No immediate concern detected. Regular monitoring and routine checkups are advised.",
            styles["Normal"]
        ))

    content.append(Spacer(1, 20))

    # ===== FOOTER =====
    content.append(Paragraph(
        "<i>This report is system-generated and intended for medical support only. "
        "Please consult a qualified healthcare professional for final diagnosis.</i>",
        styles["Italic"]
    ))

    doc.build(content)
    return file_path

# =========================
# PREDICT
# =========================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        values = data["features"]

        features = np.array(values).reshape(1, -1)
        features_scaled = scaler.transform(features)

        prediction = model.predict(features_scaled)[0]
        result = "Malignant" if prediction == 1 else "Benign"

        pdf_path = generate_pdf(data, result)

        conn = sqlite3.connect("patient.db")
        cursor = conn.cursor()

        cursor.execute("""
        INSERT INTO patients (
            patientName, age, email, mobile, address, date,
            doctorName, doctorRole,
            radius, texture, perimeter, area, smoothness, concavity,
            result, pdfPath
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["patientName"],
            data["age"],
            data["email"],
            data["mobile"],
            data["address"],
            data["date"],
            data["doctorName"],
            data["doctorRole"],
            values[0], values[1], values[2],
            values[3], values[4], values[5],
            result,
            pdf_path
        ))

        conn.commit()
        conn.close()

        return jsonify({
            "status": "success",
            "prediction": result,
            "pdf_path": pdf_path
        })

    except Exception as e:
        return jsonify({
            "status": "fail",
            "error": str(e)
        })

# =========================
# HISTORY
# =========================
@app.route("/history", methods=["GET"])
def history():
    conn = sqlite3.connect("patient.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM patients ORDER BY id DESC")
    rows = cursor.fetchall()

    conn.close()

    return jsonify({
        "status": "success",
        "data": rows
    })

# =========================
# VIEW REPORT (INLINE)
# =========================
@app.route("/view-report/<filename>")
def view_report(filename):
    path = os.path.join("reports", filename)

    if os.path.exists(path):
        return send_file(path)  # view in browser

    return jsonify({"status": "fail", "message": "Not found"})

# =========================
# DOWNLOAD REPORT
# =========================
@app.route("/download-report/<filename>")
def download_report(filename):
    path = os.path.join("reports", filename)

    if os.path.exists(path):
        return send_file(path, as_attachment=True)

    return jsonify({"status": "fail", "message": "Not found"})

# =========================
# GET REPORTS LIST
# =========================
@app.route("/reports", methods=["GET"])
def get_reports():
    conn = sqlite3.connect("patient.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT id, patientName, date, result, pdfPath
    FROM patients
    ORDER BY id DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    data = []
    for r in rows:
        data.append({
            "id": r[0],
            "name": r[1],
            "date": r[2],
            "result": r[3],
            "pdf": r[4]
        })

    return jsonify({"data": data})

# =========================
# RUN
# =========================
if __name__ == "__main__":
    app.run(debug=True)