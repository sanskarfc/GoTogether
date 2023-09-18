from dotenv import load_dotenv
from http.server import BaseHTTPRequestHandler, HTTPServer
import os
import json
import MySQLdb
import jwt

# Load environment variables from the .env file
load_dotenv()  

public_key = """
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyZxrnJ5ubnGSU+SVqoTA
oAr4kQCIenbHnQq0G1HnJDXFm6h11hAJl3eu/rxUd+1zv/0V3vk7Q3Y9R0h0Ij4C
s240rtv5qpyD4wgnQ2jA/av8bW36dt9nrFzEzJ0de1TQkqmlB1TsCQe7Gy5XmzcS
zXnZKH2HYfeGlk7H0YwKSFcewn223QwEfwtWj2vi4qLIRudcukEpWzgHAYsL/epa
zesOpmkrjyJeXYCwg52CJn/+p8rSgryo0+tmDn1BL+0bbqIaWvCb4HyEaEozV+EU
v7oWFug/fvKjXQsyHE7T5CXoDphYwOT3UNLxvkr1T7YznJwHloUti9grlBcmeUTr
BwIDAQAB
-----END PUBLIC KEY-----
""" 



connection = MySQLdb.connect(
    host=os.getenv("DATABASE_HOST"),
    user=os.getenv("DATABASE_USERNAME"),
    passwd=os.getenv("DATABASE_PASSWORD"),
    db=os.getenv("DATABASE"),
    autocommit=True,
)

# Define the handler class for handling HTTP requests
class RequestHandler(BaseHTTPRequestHandler): 
    def do_GET(self):
        if self.path == '/api/count':
            try:
                cursor = connection.cursor()
                cursor.execute("SHOW TABLES")
                tables = cursor.fetchall()
                table_count = len(tables)

                self.send_response(200)
                self.send_header("Content-type", "text/plain")
                self.end_headers()
                self.wfile.write(f"Total tables in the database: {table_count}".encode())

            except Exception as e:
                self.send_response(500)
                self.send_header("Content-type", "text/plain")
                self.end_headers()
                self.wfile.write(f"Error: {str(e)}".encode()) 

    def do_POST(self):
        if self.path == '/api/profile': 
            try: 
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length) 
                post_json = post_data.decode('utf8').replace("'", '"')
                data = json.loads(post_json) 

                print("name: ", data["name"])

                auth_header = self.headers.get('Authorization')
                if not auth_header:
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b'Authorization header is missing')
                    return 

                token = auth_header.split()[1]
                decoded_token = jwt.decode(token, public_key, algorithms=['RS256'])
                user_id = decoded_token.get('sub')  

                print("user id : ", user_id)  

                # cursor = connection.cursor()
                # cursor.execute("UPDATE Users SET name = '"+data["name"]+"', gender = '"+data["gender"]+"', age = '"+data["age"]+"' WHERE user_id = '"+user_id+"';");

                self.send_response(200)
                self.end_headers()
                self.wfile.write(b'Profile updated successfully') 

            except jwt.ExpiredSignatureError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b'Token has expired')

            except jwt.InvalidTokenError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b'Invalid token')

            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f'An error occurred: {str(e)}'.encode('utf-8'))

# Create an HTTP server and specify the port
server = HTTPServer(('10.7.48.43', 8080), RequestHandler)

try:
    print("Server listening on port 8080...")
    server.serve_forever()
except KeyboardInterrupt:
    print("Server stopped.")
    server.server_close()
