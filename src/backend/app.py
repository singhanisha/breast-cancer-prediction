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

# =========================
# PDF GENERATOR
# =========================
def generate_pdf(data, result):
    os.makedirs("reports", exist_ok=True)

    file_path = f"reports/{str(uuid.uuid4())[:8]}.pdf"

    doc = SimpleDocTemplate(file_path, pagesize=A4)
    styles = getSampleStyleSheet()
    content = []

    # Title
    content.append(Paragraph("<b>BREAST CANCER REPORT</b>", styles["Title"]))
    content.append(Spacer(1, 15))

    # Patient Info
    patient_data = [
        ["Patient Name", data["patientName"]],
        ["Age", data["age"]],
        ["Email", data["email"]],
        ["Mobile", data["mobile"]],
        ["Date", data["date"]],
    ]

    table = Table(patient_data, colWidths=[150, 300])
    table.setStyle(TableStyle([
        ("GRID", (0,0), (-1,-1), 1, colors.grey),
        ("BACKGROUND", (0,0), (0,-1), colors.lightgrey),
    ]))

    content.append(table)
    content.append(Spacer(1, 20))

    # Result
    content.append(Paragraph(f"<b>Result:</b> {result}", styles["Heading2"]))
    content.append(Spacer(1, 10))

    if result == "Malignant":
        content.append(Paragraph("⚠ Immediate doctor consultation required.", styles["Normal"]))
    else:
        content.append(Paragraph("✔ Condition appears normal. Regular checkups advised.", styles["Normal"]))

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