from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)  # ✅ ADD THIS LINE

model = pickle.load(open("model.pkl", "rb"))

@app.route("/")
def home():
    return "Breast Cancer Prediction API"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json.get("features")

        print("Received data:", data)

        # Validate input
        if data is None:
            return jsonify({"prediction": "No data received"})

        # Convert to float
        data = [float(x) for x in data]

        print("Processed data:", data)

        # Predict
        prediction = model.predict([data])[0]

        print("Raw prediction:", prediction)

        result = "Malignant" if int(prediction) == 1 else "Benign"

        return jsonify({"prediction": result})

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"prediction": "Server Error"})
    try:
        data = request.json["features"]
        prediction = model.predict([data])[0]
        result = "Malignant" if prediction == 1 else "Benign"
        return jsonify({"prediction": result})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)