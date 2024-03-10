import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchMessages(); 

        const interval = setInterval(() => {
            fetchMessages(); 
        }, 5000);

        return () => clearInterval(interval); 
    }, []);


    const fetchMessages = async () => {
        try {
            const response = await axios.post("http://192.168.194.56:5000/rpc", {
                jsonrpc: "2.0",
                method: "Chat.getMessages",
                id: 1
            });

            const data = response.data;
            if (data.result) {
                setMessages(data.result);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const sendMessage = async () => {
        if (!username || !newMessage) {
            console.error('Username and message are required.');
            return;
        }

        try {
            const response = await axios.post("http://192.168.194.56:5000/rpc", {
                jsonrpc: "2.0",
                method: "Chat.sendMessage",
                params: { username, message: newMessage },
                id: 1
            });

            const data = response.data;
            if (data.result) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Chat Application</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.username}: </strong>{msg.message}
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Your Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Type your message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
