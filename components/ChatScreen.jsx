import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { io } from 'socket.io-client';
import Config from "./../config.json";
import { useRoute } from '@react-navigation/native';
import { useAuth, useSession } from "@clerk/clerk-expo";

const ChatScreen = () => {
  const { session } = useSession();
  const route = useRoute();
  const { members, myId, groupId } = route.params; 
  console.log( "myId --> ", myId, " | groupId --> ", groupId, " | members --> ", members);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  const ipv4_address = Config.IPV4_ADDRESS;
  const serverUrl = `http://${ipv4_address}:8082`;
  const clientSocket = useRef(io(serverUrl,
    {
      query: {
        user_id: myId,
    }
    }));
  
  const handleGetMessages = async () => {
    try {
      const token = await session.getToken();
      const response = await fetch(`/api/group/reload_chat?group_id=${groupId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${token}`,
          mode: "cors",
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      setMessages(data);
    } catch (error) {
      console.error('Error loading previous chat messages', error);
    }
  };

  useEffect(() => {
    console.log("reload previous chat");
    handleGetMessages();
  }, [groupId]);

  const receiveMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'server' }]);
    flatListRef.current.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    console.log("in useEffect!");
    clientSocket.current.on('message', receiveMessage);

    return () => {
      clientSocket.current.off('message', receiveMessage);
      clientSocket.current.disconnect();
    };
  }, []);

  const updateGroupChat = (group_Id, message_Id) => {
    const chatData = {
      group_chat_id: group_Id,
      group_id: group_Id,
      message_id: message_Id,
    };

    async function sendGroupChat() {
      const token = await session.getToken();
      const ipv4_address = Config.IPV4_ADDRESS;
      fetch(`http://${ipv4_address}:8080/api/group/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${token}`,
          mode: "cors",
        },
        body: JSON.stringify(chatData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    sendGroupChat();
  };


  const sendMessage = (message_Id, message_Text, message_Number) => {
    const messageData = {
      message_id: message_Id,
      message_text: message_Text,
      message_number: message_Number,
      sender_id: myId
    };
  
    async function sendGroupMessage() {
      const token = await session.getToken();
      const ipv4_address = Config.IPV4_ADDRESS;
      fetch(`http://${ipv4_address}:8080/api/group/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${token}`,
          mode: "cors",
        },
        body: JSON.stringify(messageData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  
    sendGroupMessage();
  };
  
  const fetchUUID = async () => {
    try {
      const token = await session.getToken();
      const response = await fetch(`http://${ipv4_address}:8080/api/get_message_id`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${token}`,
          mode: "cors",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Generated UUID for this message: ", data.uuid);
      return data.uuid;
    } catch (error) {
      console.error("Error fetching UUID", error);
      return null;
    }
  };
  
  const handleSend = async () => {
    if (newMessage.trim() === '') {
      return;
    }

    const group_id = groupId;
    const message_id = await fetchUUID();
    const message_number = 0; // what is message number?

    sendMessage(message_id, newMessage, message_number)
    updateGroupChat(group_id, message_id);
    
    const data = [members, newMessage]
    clientSocket.current.emit('message', data);
    console.log('sent: ', newMessage);
    setMessages((prevMessages) => [...prevMessages, { text: newMessage, sender: 'user' }]);
    setNewMessage('');
    flatListRef.current.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.container}>
<FlatList
  data={messages}
  ref={flatListRef}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <View style={[
      styles.message,
      item.sender === 'server' ? styles.leftMessage : styles.rightMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === 'server' ? styles.receivedMessageText : null
      ]}>
        {item.text}
      </Text>
    </View>
  )}
/>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        />
        <Button title="Send" onPress={handleSend} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  message: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  leftMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#4b9ff2',
  },
  rightMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d9ed92',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  receivedMessageText: {
    color: 'white',
  },
});

export default ChatScreen;
