DROP database if exists gtdatabase;
create database gtdatabase;
use gtdatabase;

Drop table if exists users;
CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255),
    gender VARCHAR(10),
    age INT,
    ratings DECIMAL(3, 2) CHECK (ratings >= 0 AND ratings <= 5)
);

drop table if exists trip;
CREATE TABLE Trip (
    trip_id INT PRIMARY KEY,
    start_altitude DECIMAL(10, 2) NOT NULL,
    end_altitude DECIMAL(10, 2) NOT NULL,
    start_latitude DECIMAL(10, 6) NOT NULL,
    end_latitude DECIMAL(10, 6) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    number_of_seats INT NOT NULL,
    rideby INT NOT NULL,
    FOREIGN KEY (rideby) REFERENCES Users(user_id)
);

drop table if exists tripusermatch;
CREATE TABLE TripUserMatch (
    match_id INT PRIMARY KEY,
    trip_id INT,
    user_id INT,
    FOREIGN KEY (trip_id) REFERENCES Trip(trip_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);



drop table if exists personalchat;
CREATE TABLE PersonalChat (
    chat_id INT PRIMARY KEY,
    sender INT NOT NULL,
    receiver INT NOT NULL,
    FOREIGN KEY (sender) REFERENCES Users(user_id),
    FOREIGN KEY (receiver) REFERENCES Users(user_id)
);

drop table if exists message;
CREATE TABLE Message (
    message_id INT PRIMARY KEY,
    message_text TEXT NOT NULL,
    message_number INT NOT NULL
);

drop table if exists chatmessage;
CREATE TABLE ChatMessage (
    chat_message_id INT PRIMARY KEY,
    message_id INT,
    personal_chat_id INT,
    time TIMESTAMP NOT NULL,
    FOREIGN KEY (message_id) REFERENCES Message(message_id),
    FOREIGN KEY (personal_chat_id) REFERENCES PersonalChat(chat_id)
);


drop table if exists grouptable;
CREATE TABLE GroupTable (
    group_id INT PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL,
    group_created_time TIMESTAMP NOT NULL,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

drop table if exists groupmembers;
CREATE TABLE GroupMembers (
    member_id INT PRIMARY KEY,
    join_time TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    
    group_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (group_id) REFERENCES GroupTable(group_id)
);

drop table if exists grpchat;
CREATE TABLE GrpChat (
    grp_chat_id INT PRIMARY KEY,
    group_id INT,
    message_id INT,
    time TIMESTAMP NOT NULL,
    FOREIGN KEY (group_id) REFERENCES GroupTable(group_id),
    FOREIGN KEY (message_id) REFERENCES Message(message_id)
);