import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import joblib

# -----------------------------
# 1. LOAD DATASET
# -----------------------------
data = pd.read_csv("cleaned_data.csv")

print("Dataset Loaded Successfully")
print(data.head())

# -----------------------------
# 2. SELECT FEATURES (IMPORTANT)
# Must match frontend inputs
# -----------------------------
features = [
    "radius_mean",
    "texture_mean",
    "perimeter_mean",
    "area_mean",
    "smoothness_mean",
    "concavity_mean"
]

X = data[features]
y = data["diagnosis"]   # 0 = benign, 1 = malignant

# -----------------------------
# 3. TRAIN TEST SPLIT
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -----------------------------
# 4. SCALING
# -----------------------------
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# -----------------------------
# 5. TRAIN MODEL
# -----------------------------
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train_scaled, y_train)

# -----------------------------
# 6. EVALUATE MODEL
# -----------------------------
y_pred = model.predict(X_test_scaled)

accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# -----------------------------
# 7. SAVE MODEL + SCALER
# -----------------------------
joblib.dump(model, "model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("Model & Scaler saved successfully!")