from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
from dotenv import load_dotenv
import os 

load_dotenv()

app = Flask(__name__)
CORS(app)

# Edit the .env file to correct these to appropriate credentials
# Should have mysql installed, if using wsl, make sure the users and privileges
# for the host is set to '%' instead of 'localhost'
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')


# Basic use of mysql in python: 
# cur = mysql.connector.cursor()
# cur.execute("SQL COMMAND")
# mysql.connection.commit()
# cur.close()


@app.route('/test', methods=['POST'])
def test():
    return jsonify("message", "test")