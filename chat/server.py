import eventlet
import socketio
import json

with open("../config.json", "r") as config_file:
    config_data = json.load(config_file)

sio = socketio.Server(cors_allowed_origins="*")
app = socketio.WSGIApp(sio)
clients = dict()


@sio.on("connect")
def handle_connect(sid, environ):
    required_part = environ["QUERY_STRING"]
    start = required_part.find("=") + 1
    end = required_part.find("&", start)
    user_id = required_part[start:end]

    print(f"Client {user_id} with sid = {sid} connected")

    if user_id not in clients:
        clients[user_id] = sid
    clients[user_id] = sid


@sio.on("disconnect")
def handle_disconnect(sid):
    print(f"Client {sid} disconnected")
    for k, v in clients.items():
        if v == sid:
            del clients[k]
            break


@sio.on("message")
def handle_message(sid, data):
    print(f"Received message from {sid}: {data}")
    chat_members = data[0]
    msg = data[1]
    for member in chat_members:
        if clients[member] != sid:
            sio.emit("message", msg, room=clients[member])


if __name__ == "__main__":
    eventlet.wsgi.server(eventlet.listen((config_data["IPV4_ADDRESS"], 8082)), app)
