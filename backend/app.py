from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
from dotenv import load_dotenv
import hashlib
import os 

load_dotenv()

app = Flask(__name__)
CORS(app)

# Edit the .env file to correct these to appropriate credentials
# Should have mysql installed, if using wsl, make sure the users and privileges
# for the host is set to '%' instead of 'localhost' inside the app.
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

mysql = MySQL(app)

# Basic use of mysql in python: 
# cur = mysql.connector.cursor()
# cur.execute("SQL COMMAND")
# mysql.connection.commit()
# cur.close()

@app.route('/test', methods=['GET'])
def test():
    """
    Tester function, can delete when unneeded.
    :param None:
    :return jsonify: message saying "test"
    """
    return jsonify("This is a test message", ["lists work too"], {"also": "dictionaries"})

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "Invalid request"}), 400

        username = data.get('username')
        password = data.get('password')

        user_roles = [
            ("administrator", "adm_user", "adm_pass"),
            ("therapist", "ther_user", "ther_pass"),
            ("adult_patient", "apat_user", "apat_pass"),
            ("under_patient", "upat_user", "upat_pass")
        ]

        cur = mysql.connection.cursor()

        for role, user_field, pass_field in user_roles:
            query = f"SELECT * FROM {role} WHERE {user_field} = %s AND {pass_field} = %s"
            cur.execute(query, (username, password))
            result = cur.fetchone()

            if result:
                cur.close()
                return jsonify({
                    "message": f"Login successful as {role}",
                    "role": role
                }), 200

        cur.close()
        # ❌ Bad credentials = return 401
        return jsonify({"message": "Incorrect username or password"}), 401

    except Exception as e:
        print("Login error:", e)
        return jsonify({"message": "Server error"}), 500


@app.route('/register', methods=['POST'])
def register():
    pass

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5050, debug=True)
