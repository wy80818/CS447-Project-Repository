from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import pymysql
import os
import hashlib
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)


def sha256_hash(string):
    enc = string.encode('utf-8')
    hash = hashlib.sha256(enc).hexdigest()
    return hash


@app.route('/init-extra', methods=['POST'])
def init_db_extra():
    try:
        print("Connecting to MySQL without selecting a DB first...")
        connection = pymysql.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', '0000'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            autocommit=True
        )

        cursor = connection.cursor()
        print("Creating DB if not exists...")
        cursor.execute("CREATE DATABASE IF NOT EXISTS therapist_scheduler_db;")

        cursor.execute("USE therapist_scheduler_db;")

        print("Reading and executing SQL commands...")
        with open('db_init_extra.sql', 'r') as f:
            sql_commands = f.read().split(';')

            for command in sql_commands:
                command = command.strip()
                if command:
                    cursor.execute(command)

        cursor.close()
        connection.close()

        print("✅ Database and tables initialized!")
        return jsonify({"message": "Database initialized from .sql file!"}), 200

    except Exception as e:
        print("❌ Initialization error:", e)
        return jsonify({"message": f"Failed to initialize database: {e}"}), 500


@app.route('/init-db', methods=['POST'])
def init_db():
    try:
        print("Connecting to MySQL without selecting a DB first...")
        connection = pymysql.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', '0000'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            autocommit=True
        )

        cursor = connection.cursor()
        print("Creating DB if not exists...")
        cursor.execute("CREATE DATABASE IF NOT EXISTS therapist_scheduler_db;")

        cursor.execute("USE therapist_scheduler_db;")

        print("Reading and executing SQL commands...")
        with open('db_init.sql', 'r') as f:
            sql_commands = f.read().split(';')

            for command in sql_commands:
                command = command.strip()
                if command:
                    cursor.execute(command)

        cursor.close()
        connection.close()

        print("✅ Database and tables initialized!")
        return jsonify({"message": "Database initialized from .sql file!"}), 200

    except Exception as e:
        print("❌ Initialization error:", e)
        return jsonify({"message": f"Failed to initialize database: {e}"}), 500


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "Invalid request"}), 400

        username = data.get('username')
        password = sha256_hash(data.get('password'))

        user_roles = [
            ("administrator", "adm_user", "adm_pass", "adm_id"),
            ("therapist", "ther_user", "ther_pass", "ther_id"),
            ("adult_patient", "apat_user", "apat_pass", "apat_id"),
            ("under_patient", "upat_user", "upat_pass", "uapt_id")
        ]

        connection = pymysql.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', '0000'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            database=os.getenv('MYSQL_DB', 'therapist_scheduler_db'),
            cursorclass=pymysql.cursors.DictCursor
        )
        cur = connection.cursor()

        for role, user_field, pass_field, id_col in user_roles:
            query = f"SELECT * FROM {role} WHERE {user_field} = %s AND {pass_field} = %s"
            cur.execute(query, (username, password))
            result = cur.fetchone()

            if result:
                cur.close()
                connection.close()
                return jsonify({
                    "message": f"Login successful as {role}",
                    "role": role,
                    "id": result[id_col]
                }), 200

        cur.close()
        connection.close()
        return jsonify({"message": "Incorrect username or password"}), 401

    except Exception as e:
        print("Login error:", e)
        return jsonify({"message": "Server error"}), 500


@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "Invalid request"}), 400

        username = data.get('username')
        password = sha256_hash(data.get('password'))
        role = data.get('role')

        # Extended fields
        name = data.get('name')
        age = data.get('age')
        birthday = data.get('birthday')
        address = data.get('address')
        insurance = data.get('insurance')
        primary_care = data.get('primaryCare')
        email = data.get('email')

        # Validate role
        if role not in ["administrator", "therapist", "adult_patient", "under_patient"]:
            return jsonify({"message": "Invalid role"}), 400

        # Connect to DB
        connection = pymysql.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', '0000'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            database=os.getenv('MYSQL_DB', 'therapist_scheduler_db'),
            cursorclass=pymysql.cursors.DictCursor
        )
        cur = connection.cursor()

        # Role-based logic
        if role == "administrator":
            # Basic admin registration
            cur.execute("SELECT * FROM administrator WHERE adm_user = %s", (username,))
            if cur.fetchone():
                return jsonify({"message": "Username already exists"}), 400
            cur.execute("INSERT INTO administrator (adm_name, adm_user, adm_pass) VALUES (%s, %s, %s)", (name, username, password))

        elif role == "therapist":
            cur.execute("SELECT * FROM therapist WHERE ther_user = %s", (username,))
            if cur.fetchone():
                return jsonify({"message": "Username already exists"}), 400
            cur.execute("""
                INSERT INTO therapist (ther_name, ther_age, ther_bday, ther_user, ther_pass, ther_email)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (name, age, birthday, username, password, email))

        elif role == "adult_patient":
            cur.execute("SELECT * FROM adult_patient WHERE apat_user = %s", (username,))
            if cur.fetchone():
                return jsonify({"message": "Username already exists"}), 400
            cur.execute("""
                INSERT INTO adult_patient (
                    apat_name, apat_age, apat_bday, apat_user, apat_pass,
                    apat_addr, apat_insur, apat_primcare, apat_email
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (name, age, birthday, username, password, address, insurance, primary_care, email))

        elif role == "under_patient":
            cur.execute("SELECT * FROM under_patient WHERE upat_user = %s", (username,))
            if cur.fetchone():
                return jsonify({"message": "Username already exists"}), 400
            cur.execute("""
                INSERT INTO under_patient (
                    upat_name, upat_age, upat_bday, upat_user, upat_pass,
                    upat_addr, upat_insur, upat_primcare, upat_email
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (name, age, birthday, username, password, address, insurance, primary_care, email))

        connection.commit()
        cur.close()
        connection.close()

        return jsonify({"message": f"Registered as {role}!"}), 200

    except Exception as e:
        print("Register error:", e)
        return jsonify({"message": "Server error during registration"}), 500

@app.route("/save-availability", methods=["POST"])
def save_availability():
    try:
        data = request.json
        therapist_id = data.get("therapistId")
        date = data.get("date")
        location = data.get("location")
        slots = data.get("slots")

        # Connect to DB
        connection = pymysql.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', '0000'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            database=os.getenv('MYSQL_DB', 'therapist_scheduler_db'),
            cursorclass=pymysql.cursors.DictCursor
        )
        cur = connection.cursor()

        for slot in slots:
            cur.execute(
                """
                INSERT INTO availability (therapist_id, date, location, time_slot)
                VALUES (%s, %s, %s, %s)
                """,
                (therapist_id, date, location, slot)
            )

        connection.commit()
        cur.close()
        connection.close()
        return jsonify({"message": "Availability saved!"}), 200

    except Exception as e:
        print("Error saving availability:", e)
        return jsonify({"error": "Internal server error"}), 500

@app.route("/get-availability/<int:therapist_id>", methods=["GET"])
def get_availability(therapist_id):
    try:
        connection = pymysql.connect(
            host=os.getenv("MYSQL_HOST"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DB"),
            port=int(os.getenv("MYSQL_PORT")),
            cursorclass=pymysql.cursors.DictCursor
        )
        cur = connection.cursor()
        cur.execute("SELECT date, location, time_slot FROM availability WHERE therapist_id = %s", (therapist_id,))
        results = cur.fetchall()
        cur.close()
        connection.close()
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

@app.route("/get-appointments/<int:therapist_id>", methods=["GET"])
def get_appointments(therapist_id):
    try:
        connection = pymysql.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', '0000'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            database=os.getenv('MYSQL_DB', 'therapist_scheduler_db'),
            cursorclass=pymysql.cursors.DictCursor
        )
        cur = connection.cursor()

        # JOIN with adult_patient to get client name
        cur.execute("""
            SELECT 
                a.aappt_id AS id,
                a.aappt_date AS date,
                a.aappt_duration AS duration,
                a.aappt_type AS appt_type,
                a.aappt_addr AS location,
                a.status AS status,
                p.apat_name AS client_name
            FROM adult_appt a
            JOIN adult_patient p ON a.apat_id = p.apat_id
            WHERE a.ther_id = %s
        """, (therapist_id,))
        
        results = cur.fetchall()
        cur.close()
        connection.close()
        return jsonify(results), 200
    except Exception as e:
        print("❌ Error in /get-appointments:", str(e))
        return jsonify({"error": "Internal server error"}), 500


@app.route("/handle-appointment/<int:appointment_id>", methods=["POST"])
def handle_appointment(appointment_id):
    try:
        decision = request.json.get("decision")
        if decision not in ["accept", "deny"]:
            return jsonify({"error": "Invalid decision"}), 400

        connection = pymysql.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', '0000'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            database=os.getenv('MYSQL_DB', 'therapist_scheduler_db'),
            cursorclass=pymysql.cursors.DictCursor
        )
        cur = connection.cursor()
        cur.execute("""
            UPDATE adult_appt
            SET status = %s
            WHERE aappt_id = %s
        """, (decision, appointment_id))

        connection.commit()
        cur.close()
        connection.close()
        return jsonify({"message": f"Appointment {decision}ed successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

@app.route('/available-appointments', methods=['GET'])
def available_appointments():
    try:
        query_date = request.args.get('date')
        if not query_date:
            return jsonify({"error": "Missing date parameter"}), 400

        connection = pymysql.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', '0000'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            database=os.getenv('MYSQL_DB', 'therapist_scheduler_db'),
            cursorclass=pymysql.cursors.DictCursor
        )
        cur = connection.cursor()
        cur.execute("SELECT * FROM availability WHERE date = %s", (query_date,))
        results = cur.fetchall()
        cur.close()
        connection.close()
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/request-appointment', methods=['POST'])
def request_appointment():
    try:
        data = request.get_json()
        print("Incoming request:", data)

        therapist_id = data.get('therapistId')
        patient_id = data.get('patientId')
        date = data.get('date')  # Expected format: 'YYYY-MM-DD'
        appt_type = data.get('appt_type')
        duration = data.get('duration')
        location = data.get('location')

        print("Inserting into DB with:")
        print("Therapist ID:", therapist_id)
        print("Patient ID:", patient_id)
        print("Date:", date)
        print("Type:", appt_type)
        print("Duration:", duration)
        print("Location:", location)

        # Parse and confirm date format
        parsed_date = datetime.strptime(date, '%Y-%m-%d').date()
        print("Type of parsed_date:", type(parsed_date))
        print("parsed_date value:", parsed_date)

        connection = pymysql.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', '0000'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            database=os.getenv('MYSQL_DB', 'therapist_scheduler_db'),
            cursorclass=pymysql.cursors.DictCursor
        )
        cur = connection.cursor()
        cur.execute("""
            INSERT INTO adult_appt (ther_id, apat_id, aappt_type, aappt_date, aappt_duration, aappt_addr)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (therapist_id, patient_id, appt_type, parsed_date, duration, location))

        connection.commit()
        cur.close()

        return jsonify({"message": "Appointment requested!"}), 200

    except Exception as e:
        print("❌ DB insert failed:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5050, debug=True)