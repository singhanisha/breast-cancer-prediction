import sqlite3

conn = sqlite3.connect("patient.db")
cursor = conn.cursor()

print("USERS TABLE")
print("-" * 30)

cursor.execute("SELECT * FROM users")
rows = cursor.fetchall()

for row in rows:
    print(row)

print("\nPATIENTS TABLE")
print("-" * 30)

cursor.execute("SELECT * FROM patients")
patients = cursor.fetchall()

for patient in patients:
    print(patient)

conn.close()