import eventlet
import socketio
import json

with open("../config.json", "r") as config_file:
    config_data = json.load(config_file)

sio = socketio.Server(cors_allowed_origins="*")
app = socketio.WSGIApp(sio)
clients = dict()
in_the_room = dict()


@sio.on("connect")
def handle_connect(sid, environ):
    s = environ["QUERY_STRING"]
    user_id_start = s.find("user_id=") + len("user_id=")
    user_id_end = s.find("&", user_id_start)
    user_id = s[user_id_start:user_id_end]
    group_id_start = s.find("group_id=") + len("group_id=")
    group_id_end = s.find("&", group_id_start)
    group_id = s[group_id_start:group_id_end]

    print(f"Client {user_id} in group {group_id} with sid = {sid} connected")

    if user_id not in clients:
        clients[user_id] = sid
    clients[user_id] = sid

    if group_id not in in_the_room:
        # in_the_room[group_id] = dict()
        in_the_room[group_id] = set()

    if user_id not in in_the_room[group_id]:
        # in_the_room[group_id][user_id] = True
        in_the_room[group_id].add(user_id)


@sio.on("disconnect")
def handle_disconnect(sid):
    print(f"Client {sid} disconnected")
    for k, v in clients.items():
        if v == sid:
            del clients[k]
            break


@sio.on("removeFromChat")
def handle_removal(sid, data):
    uid = data[0]
    gid = data[1]
    in_the_room[gid].remove(uid)


@sio.on("message")
def handle_message(sid, data):
    print(f"Received message from {sid}: {data}")
    group_id = data[0]
    msg = data[1]
    my_id = data[2]

    ## From data get group_id and then send to all users who are present in that room using in_the_room[groupId]
    # for member in chat_members:
    for member in in_the_room[group_id]:
        if member in clients and clients[member] != sid:
            sio.emit("message", msg, room=clients[member])


if __name__ == "__main__":
    eventlet.wsgi.server(eventlet.listen((config_data["IPV4_ADDRESS"], 8082)), app)
