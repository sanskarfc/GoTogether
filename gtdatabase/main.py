from dotenv import load_dotenv
import datetime
import uuid
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
        if self.path == '/api/profile':
            try:
                auth_header = self.headers.get('Authorization')
                if not auth_header:
                    print("no authorization header!")
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b'Authorization header is missing')
                    return 

                token = auth_header.split()[1]
                decoded_token = jwt.decode(token, public_key, algorithms=['RS256'])
                user_id = decoded_token.get('sub') 

                cursor = connection.cursor()
                cursor.execute("SELECT * from Users where user_id='" + user_id + "'")
                user_data = cursor.fetchone()
                print(user_data)

                if user_data:
                    user_dict = {
                        'name': user_data[1],
                        'gender': user_data[3],
                        'age': user_data[4],
                        'rating': user_data[5],
                        'profilePic': user_data[2],
                    }

                    json_response = json.dumps(user_dict)

                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json_response.encode('utf-8'))
                else:
                    self.send_response(404)  # Not Found
                    self.end_headers()
                    self.wfile.write(b'User not found')

            except jwt.ExpiredSignatureError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b'Token has expired')

            except jwt.InvalidTokenError:
                print("jwt invalid token error!!!")
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b'Invalid token')

            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f'An error occurred: {str(e)}'.encode('utf-8')) 

    def do_POST(self):
        if self.path == '/api/profile': 
            try: 
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length) 
                post_json = post_data.decode('utf8').replace("'", '"')
                data = json.loads(post_json) 

                auth_header = self.headers.get('Authorization')
                if not auth_header:
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b'Authorization header is missing')
                    return 

                token = auth_header.split()[1]
                decoded_token = jwt.decode(token, public_key, algorithms=['RS256'])
                user_id = decoded_token.get('sub')  

                cursor = connection.cursor()
                cursor.execute("UPDATE Users SET  name = '"+data["name"]+"', gender = '"+data["gender"]+"', age = '"+data["age"]+"' WHERE user_id = '"+user_id+"';");

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
        
        if self.path == '/api/user':  
            try: 
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length) 
                post_json = post_data.decode('utf8').replace("'", '"')
                data = json.loads(post_json) 

                auth_header = self.headers.get('Authorization')
                if not auth_header:
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b'Authorization header is missing')
                    return 

                token = auth_header.split()[1]
                decoded_token = jwt.decode(token, public_key, algorithms=['RS256'])
                user_id = decoded_token.get('sub')  

                cursor = connection.cursor(); 
                cursor.execute("INSERT into Users SET user_id='"+user_id+"', name='"+data["name"]+"', gender=NULL, age=NULL, profile_pic='"+data["profilePic"]+"', ratings=5;")

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

        if self.path == '/api/trip':  
            try: 
                print("adding detail to trip!")
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length) 
                post_json = post_data.decode('utf8').replace("'", '"')
                data = json.loads(post_json)

                auth_header = self.headers.get('Authorization')
                if not auth_header:
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b'Authorization header is missing')
                    return  

                token = auth_header.split()[1]
                decoded_token = jwt.decode(token, public_key, algorithms=['RS256'])
                user_id = decoded_token.get('sub')    

                new_uuid = uuid.uuid4()
                uuid_str = str(new_uuid)
                
                start_latitude = data["startCoordinates"]["latitude"]
                start_longitude = data["startCoordinates"]["longitude"]
                end_latitude = data["endCoordinates"]["latitude"]
                end_longitude = data["endCoordinates"]["longitude"]

                input_date_str = (data["date"]).replace("GMT", "")  # Remove "GMT" from the string
                input_date = datetime.datetime.strptime(input_date_str, "%a %b %d %Y %H:%M:%S %z")
                timestamp_str = input_date.strftime('%Y-%m-%d %H:%M:%S')

                cursor = connection.cursor(); 
                cursor.execute("INSERT into Trip SET trip_id='"+uuid_str+"', start_longitude="+str(start_longitude)+", start_latitude="+str(start_latitude)+", end_latitude="+str(end_latitude)+", end_longitude="+str(end_longitude)+", number_of_seats=" + str(data["freeSeats"][0]) + ", number_of_females=" + str(data["ladiesValue"][0]) + ", rideby='"+user_id+"', start_time='"+timestamp_str+"';")

                self.send_response(200)
                self.end_headers()
                self.wfile.write(b'Trip Added Successfully') 

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
server = HTTPServer(('10.7.47.190', 8080), RequestHandler)

try:
    print("Server listening on port 8080...")
    server.serve_forever()
except KeyboardInterrupt:
    print("Server stopped.")
    server.server_close()
