import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { io } from 'socket.io-client';
import Config from "./../config.json";
import { useRoute } from '@react-navigation/native';

const ChatScreen = () => {
  const route = useRoute();
  const { matcherId, myId } = route.params; 
  console.log("matcherId --> ", matcherId);
  console.log("myId --> ", myId);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  const ipv4_address = Config.IPV4_ADDRESS;
  const serverUrl = `http://${ipv4_address}:8082`;
  const clientSocket = useRef(io(serverUrl));

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

  const handleSend = () => {
    if (newMessage.trim() === '') {
      return;
    }

    clientSocket.current.emit('message', newMessage);
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
