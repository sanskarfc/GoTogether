DROP database if exists gtdatabase;
create database gtdatabase;
use gtdatabase;

Drop table if exists Users;
CREATE TABLE Users (
    user_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255),
    gender VARCHAR(10),
    age INT,
    ratings DECIMAL(3, 2) CHECK (ratings >= 0 AND ratings <= 5)
);

drop table if exists Trip;
CREATE TABLE Trip (
    trip_id INT PRIMARY KEY,
    start_altitude DECIMAL(10, 2) NOT NULL,
    end_altitude DECIMAL(10, 2) NOT NULL,
    start_latitude DECIMAL(10, 6) NOT NULL,
    end_latitude DECIMAL(10, 6) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    number_of_seats INT NOT NULL,
    rideby INT NOT NULL,
    KEY rideby_idx (rideby)
);

drop table if exists TripUserMatch;
CREATE TABLE TripUserMatch (
    match_id INT PRIMARY KEY,
    trip_id INT,
    user_id INT,
    KEY trip_id_idx (trip_id),
    KEY user_id_idx (user_id)
);



drop table if exists PersonalChat;
CREATE TABLE PersonalChat (
    chat_id INT PRIMARY KEY,
    sender INT NOT NULL,
    receiver INT NOT NULL,
    KEY sender_idx (sender),
    KEY receiver_idx (receiver)
);

drop table if exists Message;
CREATE TABLE Message (
    message_id INT PRIMARY KEY,
    message_text TEXT NOT NULL,
    message_number INT NOT NULL
);

drop table if exists ChatMessage;
CREATE TABLE ChatMessage (
    chat_message_id INT PRIMARY KEY,
    message_id INT,
    personal_chat_id INT,
    time TIMESTAMP NOT NULL,
    KEY message_id_idx (message_id),
    KEY personal_chat_id_idx (personal_chat_id)
);


drop table if exists GroupTable;
CREATE TABLE GroupTable (
    group_id INT PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL,
    group_created_time TIMESTAMP NOT NULL,
    created_by INT NOT NULL,
    KEY created_by_idx (created_by)
);

drop table if exists GroupMembers;
CREATE TABLE GroupMembers (
    member_id INT PRIMARY KEY,
    join_time TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
      group_id INT NOT NULL,
      KEY user_id_idx (user_id),
    KEY group_id_idx (group_id)
);

drop table if exists GrpChat;
CREATE TABLE GrpChat (
    grp_chat_id INT PRIMARY KEY,
    group_id INT,
    message_id INT,
    time TIMESTAMP NOT NULL,
    KEY group_id_idx (group_id),
    KEY message_id_idx (message_id)
);
