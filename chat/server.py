import eventlet
import socketio
import json

with open("../config.json", "r") as config_file:
    config_data = json.load(config_file)

sio = socketio.Server(cors_allowed_origins="*")
app = socketio.WSGIApp(sio)
clients = set()


@sio.on("connect")
def handle_connect(sid, environ):
    print(f"Client {sid} connected")
    clients.add(sid)


@sio.on("disconnect")
def handle_disconnect(sid):
    print(f"Client {sid} disconnected")
    clients.remove(sid)


@sio.on("message")
def handle_message(sid, data):
    print(f"Received message from {sid}: {data}")
    for client in clients:
        if client != sid:
            sio.emit("message", data, room=client)


if __name__ == "__main__":
    eventlet.wsgi.server(eventlet.listen((config_data["IPV4_ADDRESS"], 8082)), app)
