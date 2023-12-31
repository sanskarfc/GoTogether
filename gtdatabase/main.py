from dotenv import load_dotenv
import requests
import math
import datetime
import uuid
from http.server import BaseHTTPRequestHandler, HTTPServer
import os
import json
import MySQLdb
import jwt
from urllib.parse import parse_qs
from urllib.parse import urlparse

with open("../config.json", "r") as config_file:
    config_data = json.load(config_file)

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
    ssl={"rejectUnauthorized": True},
)


def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of the Earth in kilometers
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)

    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c  # Distance in kilometers
    return distance


# Define the handler class for handling HTTP requests
class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/get_uuid":
            try:
                auth_header = self.headers.get("Authorization")
                if not auth_header:
                    print("no authorization header!")
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b"Authorization header is missing")
                    return

                token = auth_header.split()[1]
                options = {"verify_exp": False, "verify_aud": False}
                decoded_token = jwt.decode(
                    token, public_key, algorithms=["RS256"], options=options
                )
                print(decoded_token)
                # user_id = decoded_token.get("sub")

                new_uuid = uuid.uuid4()
                uuid_str = str(new_uuid)
                print("Generated uuid: ", uuid_str)

                response_data = {"uuid": uuid_str}
                json_response = json.dumps(response_data)

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json_response.encode("utf-8"))

            except jwt.ExpiredSignatureError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Token has expired")

            except jwt.InvalidTokenError:
                print("jwt invalid token error!!!")
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Invalid token")

            except Exception as e:
                print("Error: ", str(e))
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"An error occurred: {str(e)}".encode("utf-8"))

        if self.path == "/api/reload":
            print("Chat Reloading!!!")
            ## Is this Auth header required? (see the APIs below)
            try:
                auth_header = self.headers.get("Authorization")
                gid = str(self.headers.get("gid"))
                # print("GID:", group_id)
                if not auth_header:
                    print("no authorization header!")
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b"Authorization header is missing")
                    return

                token = auth_header.split()[1]
                options = {"verify_exp": False, "verify_aud": False}
                decoded_token = jwt.decode(
                    token, public_key, algorithms=["RS256"], options=options
                )
                user_id = decoded_token.get("sub")

                # query_params = parse_qs(urlparse(self.path).query)
                # group_id = query_params.get("gid")

                if not gid:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b"Missing group_id parameter")
                    return

                cursor = connection.cursor()
                cursor.execute(
                    f"SELECT message_id, msg_time FROM GrpChat WHERE group_id = '{gid}' ORDER BY msg_time"
                )
                grp_chat_data = cursor.fetchall()

                # print("Group Chat Data:", grp_chat_data)
                message_list = []

                for entry in grp_chat_data:
                    message_id = entry[0]
                    cursor.execute(
                        f"SELECT message_text, sender_id FROM Message WHERE message_id = '{message_id}'"
                    )
                    message_data = cursor.fetchone()
                    if message_data:
                        message_text, sender_id = message_data
                        message_list.append([message_text, sender_id])

                print("Previous Chat History: ", message_list)

                # if not message_list:
                #     message_list.append(["hi", user_id])
                # json_response = json.dumps(message_list)
                # self.send_response(200)
                # self.send_header("Content-Type", "application/json")
                # self.end_headers()
                # self.wfile.write(json_response.encode("utf-8"))
                if message_list:
                    json_response = json.dumps(message_list)
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json_response.encode("utf-8"))
                else:
                    self.send_response(404)  # Not Found
                    self.end_headers()
                    self.wfile.write(b"No messages found for the given group_id")
            except jwt.ExpiredSignatureError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Token has expired")

            except jwt.InvalidTokenError:
                print("jwt invalid token error!!!")
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Invalid token")

            except Exception as e:
                print("Error:", str(e))
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"An error occurred: {str(e)}".encode("utf-8"))

        if self.path == "/api/group/chat":
            try:
                auth_header = self.headers.get("Authorization")
                if not auth_header:
                    print("no authorization header!")
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b"Authorization header is missing")
                    return

                token = auth_header.split()[1]
                options = {"verify_exp": False, "verify_aud": False}
                decoded_token = jwt.decode(
                    token, public_key, algorithms=["RS256"], options=options
                )
                user_id = decoded_token.get("sub")

                cursor = connection.cursor()
                cursor.execute(
                    "SELECT group_id FROM GroupMembers WHERE user_id='" + user_id + "'"
                )
                user_data = cursor.fetchall()

                user_dict = {}

                for groupData in user_data:
                    membersList = []
                    cursor.execute(
                        "SELECT user_id FROM GroupMembers WHERE group_id = '"
                        + groupData[0]
                        + "';"
                    )
                    groupMembersData = cursor.fetchall()
                    for memberData in groupMembersData:
                        membersList.append(memberData[0])

                    user_dict.update({groupData[0]: membersList})

                if user_dict:
                    json_response = json.dumps(user_dict)
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json_response.encode("utf-8"))
                else:
                    self.send_response(404)  # Not Found
                    self.end_headers()
                    self.wfile.write(b"User not found")

            except jwt.ExpiredSignatureError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Token has expired")

            except jwt.InvalidTokenError:
                print("jwt invalid token error!!!")
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Invalid token")

            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"An error occurred: {str(e)}".encode("utf-8"))

        if self.path == "/api/profile":
            try:
                auth_header = self.headers.get("Authorization")
                if not auth_header:
                    print("no authorization header!")
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b"Authorization header is missing")
                    return

                token = auth_header.split()[1]
                options = {"verify_exp": False, "verify_aud": False}
                decoded_token = jwt.decode(
                    token, public_key, algorithms=["RS256"], options=options
                )
                user_id = decoded_token.get("sub")

                cursor = connection.cursor()
                cursor.execute("SELECT * from Users where user_id='" + user_id + "'")
                user_data = cursor.fetchone()

                # print(user_data)

                if user_data:
                    user_dict = {
                        "name": user_data[1],
                        "gender": user_data[3],
                        "age": user_data[4],
                        "rating": user_data[5],
                        "profilePic": user_data[2],
                    }

                    json_response = json.dumps(user_dict)

                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json_response.encode("utf-8"))
                else:
                    self.send_response(404)  # Not Found
                    self.end_headers()
                    self.wfile.write(b"User not found")

            except jwt.ExpiredSignatureError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Token has expired")

            except jwt.InvalidTokenError:
                print("jwt invalid token error!!!")
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Invalid token")

            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"An error occurred: {str(e)}".encode("utf-8"))

        if self.path == "/api/match":
            try:
                auth_header = self.headers.get("Authorization")
                if not auth_header:
                    print("no authorization header!")
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b"Authorization header is missing")
                    return

                token = auth_header.split()[1]

                options = {"verify_exp": False, "verify_aud": False}
                decoded_token = jwt.decode(
                    token, public_key, algorithms=["RS256"], options=options
                )
                user_id = decoded_token.get("sub")

                cursor = connection.cursor()
                cursor.execute(
                    "SELECT name from Users where user_id='" + user_id + "';"
                )
                user_name = str((cursor.fetchone())[0])
                # print("user name --> ", user_name)

                cursor.execute("SELECT * FROM Trip where rideby!='" + user_id + "';")
                user_data = cursor.fetchall()

                cursor.execute("SELECT * from Trip where rideby='" + user_id + "'")
                current_user_trip_details = cursor.fetchone()

                poolType = str(current_user_trip_details[9])
                user1_startLat = float(current_user_trip_details[1])
                user1_startLon = float(current_user_trip_details[3])
                user1_endLat = float(current_user_trip_details[2])
                user1_endLon = float(current_user_trip_details[4])

                response_data = {}
                for trip in user_data:
                    trip_id = trip[0]
                    cursor.execute(
                        "SELECT * FROM Users where user_id='" + trip[8] + "';"
                    )
                    rider_details = cursor.fetchone()
                    rider_name = rider_details[1]

                    distance = calculate_distance(
                        user1_startLat, user1_startLon, float(trip[1]), float(trip[3])
                    )

                    ##################### SENDING POST REQUEST FOR TIMES #######################
                    url = "https://api.openrouteservice.org/v2/matrix/driving-car"

                    ALat = user1_startLat
                    ALon = user1_startLon
                    BLat = user1_endLat
                    BLon = user1_endLon

                    CLat = float(trip[1])
                    CLon = float(trip[3])
                    DLat = float(trip[2])
                    DLon = float(trip[4])

                    timeAB = 0
                    timeAD = 0
                    timeDB = 0

                    ################# A --> B ##################
                    locationData = {
                        "locations": [[ALon, ALat], [BLon, BLat]],
                        "destinations": [1],
                    }
                    headers = {
                        "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
                        "Authorization": os.getenv("OPEN_SOURCE_KEY"),
                        "Content-Type": "application/json; charset=utf-8",
                    }

                    response = requests.post(
                        url, data=json.dumps(locationData), headers=headers
                    )

                    if response.status_code == 200:
                        jsonDataResponse = json.loads(response.text)
                        timeAB = (jsonDataResponse.get("durations"))[0][0]
                    else:
                        print(
                            "POST request failed with status code:",
                            response.status_code,
                        )

                    #################   END    ###################

                    ################# A --> D ##################
                    locationData = {
                        "locations": [[ALon, ALat], [DLon, DLat]],
                        "destinations": [1],
                    }
                    headers = {
                        "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
                        "Authorization": os.getenv("OPEN_SOURCE_KEY"),
                        "Content-Type": "application/json; charset=utf-8",
                    }

                    response = requests.post(
                        url, data=json.dumps(locationData), headers=headers
                    )

                    if response.status_code == 200:
                        jsonDataResponse = json.loads(response.text)
                        timeAD = (jsonDataResponse.get("durations"))[0][0]
                    else:
                        print(
                            "POST request failed with status code:",
                            response.status_code,
                        )

                    #####################   END   ###################

                    ################# D --> B ##################
                    locationData = {
                        "locations": [[DLon, DLat], [BLon, BLat]],
                        "destinations": [1],
                    }
                    headers = {
                        "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
                        "Authorization": os.getenv("OPEN_SOURCE_KEY"),
                        "Content-Type": "application/json; charset=utf-8",
                    }

                    response = requests.post(
                        url, data=json.dumps(locationData), headers=headers
                    )

                    if response.status_code == 200:
                        jsonDataResponse = json.loads(response.text)
                        timeDB = (jsonDataResponse.get("durations"))[0][0]
                    else:
                        print(
                            "POST request failed with status code:",
                            response.status_code,
                        )
                    #################    END   ######################

                    # print("timeAB --> ", timeAB)
                    # print("timeAD --> ", timeAD)
                    # print("timeDB --> ", timeDB)

                    ##########################################################################

                    formattedDetour = "{:.1f}".format(
                        float(timeAD + timeDB - timeAB) / 60
                    )
                    # print("abcd --> ", formattedDetour)

                    if distance < 5 and str(trip[8]) != user_id:
                        response_data[trip_id] = {
                            "Start Latitude": float(trip[1]),
                            "End Latitude": float(trip[2]),
                            "Start Longitude": float(trip[3]),
                            "End Longitude": float(trip[4]),
                            "Ride Start Time": str(trip[5]),
                            "Rider": str(rider_name),
                            "RiderId": str(trip[8]),
                            "Your Detour": formattedDetour,
                        }

                # print(response_data)
                json_response = json.dumps(response_data)

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json_response.encode("utf-8"))

            except jwt.ExpiredSignatureError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Token has expired")

            except jwt.InvalidTokenError:
                print("jwt invalid token error!!!")
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Invalid token")

            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"An error occurred: {str(e)}".encode("utf-8"))

    def do_POST(self):
        if self.path == "/api/group/message":
            try:
                content_length = int(self.headers["Content-Length"])
                post_data = self.rfile.read(content_length)
                post_json = post_data.decode("utf8").replace("'", '"')
                data = json.loads(post_json)

                print(data)

                message_id = str(data.get("message_id"))
                message_text = str(data.get("message_text"))
                message_number = int(data.get("message_number"))
                sender_id = str(data.get("sender_id"))

                cursor = connection.cursor()
                cursor.execute(
                    "INSERT INTO Message (message_id, message_text, message_number, sender_id) VALUES (%s, %s, %s, %s);",
                    (
                        str(message_id),
                        str(message_text),
                        int(message_number),
                        str(sender_id),
                    ),
                )
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"Message added successfully")

            except jwt.ExpiredSignatureError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Token has expired")

            except jwt.InvalidTokenError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Invalid token")

            except Exception as e:
                print("SQL execution error:", str(e))
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"An error occurred: {str(e)}".encode("utf-8"))

        if self.path == "/api/group/chat":
            try:
                content_length = int(self.headers["Content-Length"])
                post_data = self.rfile.read(content_length)
                post_json = post_data.decode("utf8").replace("'", '"')
                data = json.loads(post_json)

                group_chat_id = str(data.get("group_chat_id"))
                group_id = str(data.get("group_id"))
                message_id = str(data.get("message_id"))

                iso_timestamp = str(data["msg_time"])
                iso_timestamp = iso_timestamp.replace("Z", "").split(".")[0]
                iso_timestamp = iso_timestamp.replace("T", " ").split(".")[0]
                parsed_datetime = datetime.datetime.strptime(
                    iso_timestamp, "%Y-%m-%d %H:%M:%S"
                )
                mysql_timestamp = parsed_datetime.strftime("%Y-%m-%d %H:%M:%S")

                cursor = connection.cursor()
                cursor.execute(
                    "INSERT INTO GrpChat (grp_chat_id, group_id, message_id, msg_time) VALUES (%s, %s, %s, %s);",
                    (
                        str(group_chat_id),
                        str(group_id),
                        str(message_id),
                        str(mysql_timestamp),
                    ),
                )
                # connection.commit()

                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"Group chat updated successfully")

            except jwt.ExpiredSignatureError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Token has expired")

            except jwt.InvalidTokenError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Invalid token")

            except Exception as e:
                print("SQL execution error:", str(e))
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"An error occurred: {str(e)}".encode("utf-8"))

        if self.path == "/api/group/create":
            try:
                content_length = int(self.headers["Content-Length"])
                post_data = self.rfile.read(content_length)
                post_json = post_data.decode("utf8").replace("'", '"')
                data = json.loads(post_json)

                auth_header = self.headers.get("Authorization")
                if not auth_header:
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b"Authorization header is missing")
                    return

                token = auth_header.split()[1]
                options = {"verify_exp": False, "verify_aud": False}
                decoded_token = jwt.decode(
                    token, public_key, algorithms=["RS256"], options=options
                )
                user_id = decoded_token.get("sub")

                new_uuid = uuid.uuid4()
                uuid_str = str(new_uuid)

                iso_timestamp = str(data["group_created_time"])
                iso_timestamp = iso_timestamp.replace("Z", "").split(".")[0]
                iso_timestamp = iso_timestamp.replace("T", " ").split(".")[0]
                parsed_datetime = datetime.datetime.strptime(
                    iso_timestamp, "%Y-%m-%d %H:%M:%S"
                )
                mysql_timestamp = parsed_datetime.strftime("%Y-%m-%d %H:%M:%S")

                cursor = connection.cursor()

                cursor.execute(  # create the group with this list
                    "INSERT INTO GroupTable (group_id, group_created_time, created_by) VALUES (%s, %s, %s);",
                    (
                        str(uuid_str),
                        str(mysql_timestamp),
                        str(user_id),
                    ),
                )

                tempUUID = uuid.uuid4()
                tempUUID_str = str(tempUUID)
                cursor.execute(
                    "INSERT INTO GroupMembers (member_id, user_id, group_id) VALUES (%s, %s, %s);",
                    (
                        str(tempUUID_str),
                        str(user_id),
                        str(uuid_str),
                    ),
                )

                for members in data["memberList"]:
                    memberUUID = uuid.uuid4()
                    memberUUID_str = str(memberUUID)
                    cursor.execute(
                        "INSERT INTO GroupMembers (member_id, user_id, group_id) VALUES (%s, %s, %s);",
                        (
                            str(memberUUID_str),
                            str(members),
                            str(uuid_str),
                        ),
                    )

                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"Profile updated successfully")

            except jwt.ExpiredSignatureError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Token has expired")

            except jwt.InvalidTokenError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Invalid token")

            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"An error occurred: {str(e)}".encode("utf-8"))

        if self.path == "/api/profile":
            try:
                content_length = int(self.headers["Content-Length"])
                post_data = self.rfile.read(content_length)
                post_json = post_data.decode("utf8").replace("'", '"')
                data = json.loads(post_json)

                auth_header = self.headers.get("Authorization")
                if not auth_header:
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b"Authorization header is missing")
                    return

                token = auth_header.split()[1]
                # print("hey")
                options = {"verify_exp": False, "verify_aud": False}
                decoded_token = jwt.decode(
                    token, public_key, algorithms=["RS256"], options=options
                )
                user_id = decoded_token.get("sub")

                cursor = connection.cursor()
                cursor.execute(
                    "UPDATE Users SET  name = '"
                    + data["name"]
                    + "', gender = '"
                    + data["gender"]
                    + "', age = '"
                    + data["age"]
                    + "' WHERE user_id = '"
                    + user_id
                    + "';"
                )

                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"Profile updated successfully")

            except jwt.ExpiredSignatureError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Token has expired")

            except jwt.InvalidTokenError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Invalid token")

            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"An error occurred: {str(e)}".encode("utf-8"))

        if self.path == "/api/user":
            try:
                content_length = int(self.headers["Content-Length"])
                post_data = self.rfile.read(content_length)
                post_json = post_data.decode("utf8").replace("'", '"')
                data = json.loads(post_json)

                auth_header = self.headers.get("Authorization")
                if not auth_header:
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b"Authorization header is missing")
                    return

                token = auth_header.split()[1]
                options = {"verify_exp": False, "verify_aud": False}
                decoded_token = jwt.decode(
                    token, public_key, algorithms=["RS256"], options=options
                )
                user_id = decoded_token.get("sub")

                cursor = connection.cursor()
                cursor.execute(
                    "INSERT INTO Users (user_id, name, gender, age, profile_pic, ratings) VALUES (%s, %s, %s, %s, %s, %s);",
                    (
                        str(user_id),
                        str(data["name"]),
                        None,
                        None,
                        str(data["profilePic"]),
                        str(5),
                    ),
                )

                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"Profile updated successfully")

            except jwt.ExpiredSignatureError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Token has expired")

            except jwt.InvalidTokenError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Invalid token")

            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"An error occurred: {str(e)}".encode("utf-8"))

        if self.path == "/api/trip":
            try:
                content_length = int(self.headers["Content-Length"])
                post_data = self.rfile.read(content_length)
                post_json = post_data.decode("utf8").replace("'", '"')
                data = json.loads(post_json)

                auth_header = self.headers.get("Authorization")
                if not auth_header:
                    self.send_response(401)
                    self.end_headers()
                    self.wfile.write(b"Authorization header is missing")
                    return

                token = auth_header.split()[1]
                options = {"verify_exp": False, "verify_aud": False}

                decoded_token = jwt.decode(
                    token, public_key, algorithms=["RS256"], options=options
                )
                user_id = decoded_token.get("sub")

                new_uuid = uuid.uuid4()
                uuid_str = str(new_uuid)

                start_latitude = data["startCoordinates"]["latitude"]
                start_longitude = data["startCoordinates"]["longitude"]
                end_latitude = data["endCoordinates"]["latitude"]
                end_longitude = data["endCoordinates"]["longitude"]

                input_date_str = (data["date"]).replace("GMT", "")
                input_date = datetime.datetime.strptime(
                    input_date_str, "%a %b %d %Y %H:%M:%S %z"
                )
                timestamp_str = input_date.strftime("%Y-%m-%d %H:%M:%S")

                cursor = connection.cursor()

                cursor.execute(
                    "SELECT COUNT(*) FROM Trip WHERE rideby = '" + user_id + "';"
                )
                user_data = cursor.fetchone()

                # print("user_data --> ", user_data)
                if user_data[0] == 0:
                    if data["poolType"] == "car":
                        cursor.execute(
                            "INSERT INTO Trip (trip_id, start_longitude, start_latitude, end_latitude, end_longitude, number_of_seats, number_of_females, rideby, start_time, poolType, seatsNeeded) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
                            (
                                str(uuid_str),
                                str(start_longitude),
                                str(start_latitude),
                                str(end_latitude),
                                str(end_longitude),
                                str(data["freeSeats"][0]),
                                str(data["ladiesValue"][0]),
                                str(user_id),
                                str(timestamp_str),
                                str(data["poolType"]),
                                None,
                            ),
                        )
                    else:
                        cursor.execute(
                            "INSERT INTO Trip (trip_id, start_longitude, start_latitude, end_latitude, end_longitude, number_of_seats, number_of_females, rideby, start_time, poolType, seatsNeeded) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
                            (
                                str(uuid_str),
                                str(start_longitude),
                                str(start_latitude),
                                str(end_latitude),
                                str(end_longitude),
                                None,
                                None,
                                str(user_id),
                                str(timestamp_str),
                                str(data["poolType"]),
                                str(data["seatsNeeded"][0]),
                            ),
                        )
                    print("Added Trip to Database")
                else:
                    print("A trip already exists for this user! Not adding this one.")

                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"Trip Added Successfully")

            except jwt.ExpiredSignatureError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Token has expired")

            except jwt.InvalidTokenError:
                self.send_response(401)
                self.end_headers()
                self.wfile.write(b"Invalid token")

            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"An error occurred: {str(e)}".encode("utf-8"))


# Create an HTTP server and specify the port
server = HTTPServer((config_data["IPV4_ADDRESS"], 8080), RequestHandler)

try:
    print("Server listening on port 8080...")
    server.serve_forever()
except KeyboardInterrupt:
    print("Server stopped.")
    server.server_close()
