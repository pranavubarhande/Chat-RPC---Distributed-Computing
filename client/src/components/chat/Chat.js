// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Chat = () => {
//     const [messages, setMessages] = useState([]);
//     const [username, setUsername] = useState('');
//     const [newMessage, setNewMessage] = useState('');

//     useEffect(() => {
//         fetchMessages(); 

//         const interval = setInterval(() => {
//             fetchMessages(); 
//         }, 5000);

//         return () => clearInterval(interval); 
//     }, []);


//     const fetchMessages = async () => {
//         try {
//             const response = await axios.post("http://192.168.194.56:5000/rpc", {
//                 jsonrpc: "2.0",
//                 method: "Chat.getMessages",
//                 id: 1
//             });

//             const data = response.data;
//             if (data.result) {
//                 setMessages(data.result);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     const sendMessage = async () => {
//         if (!username || !newMessage) {
//             console.error('Username and message are required.');
//             return;
//         }

//         try {
//             const response = await axios.post("http://192.168.194.56:5000/rpc", {
//                 jsonrpc: "2.0",
//                 method: "Chat.sendMessage",
//                 params: { username, message: newMessage },
//                 id: 1
//             });

//             const data = response.data;
//             if (data.result) {
//                 setNewMessage('');
//                 fetchMessages();
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>Chat Application</h1>
//             <div>
//                 {messages.map((msg, index) => (
//                     <div key={index}>
//                         <strong>{msg.username}: </strong>{msg.message}
//                     </div>
//                 ))}
//             </div>
//             <div>
//                 <input
//                     type="text"
//                     placeholder="Your Username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                 />
//                 <input
//                     type="text"
//                     placeholder="Type your message"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                 />
//                 <button onClick={sendMessage}>Send</button>
//             </div>
//         </div>
//     );
// };

// export default Chat;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';
import QuillComponent from '../quill';
const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState('user1');
    const [newMessage, setNewMessage] = useState('');
    const users = ['user1', 'user2', 'user3'];

    useEffect(() => {
        fetchMessages();
        
        // const interval = setInterval(() => {
        //     fetchMessages();
        // }, 5000);

        // return () => clearInterval(interval);
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.post("http://192.168.31.235:5000/rpc", {
                jsonrpc: "2.0",
                method: "Chat.getMessages",
                id: 1
            });

            const data = response.data;
            if (data.result) {
                setMessages(data.result);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // const fetchUsers = async () => {
    //     try {
    //         const response = await axios.post("http://192.168.31.235:5000/rpc", {
    //             jsonrpc: "2.0",
    //             method: "Chat.getUsers",
    //             id: 1
    //         });

    //         const data = response.data;
    //         if (data.result) {
    //             setUsers(data.result);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching users:', error);
    //     }
    // };

    const sendMessage = async () => {
        if (!selectedUser || !newMessage) {
            console.error('User and message are required.');
            return;
        }

        try {
            const response = await axios.post("http://192.168.31.235:5000/rpc", {
                jsonrpc: "2.0",
                method: "Chat.sendMessage",
                params: { username: selectedUser, message: newMessage },
                id: 1
            });

            const data = response.data;
            if (data.result) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chat-container">
            <div className="side-menu">
                <h2>Users</h2>
                <div>
                    {users.map((user, index) => (
                        <div key={index} className={selectedUser === user ? 'selected' : ''}>{user}</div>
                    ))}
                </div>
            </div>

            <div className="chat-area">
                <div className="header">
                    <h1>Chat Application</h1>
                </div>
                <QuillComponent />
                <div className="message-list">
                    {messages.map((msg, index) => (
                        <div key={index} className="message">
                            <strong>{msg.username}: </strong>{msg.message}
                        </div>
                    ))}
                </div>
                <div className="input-area">
                    <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                        {users.map((user, index) => (
                            <option key={index} value={user}>{user}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Type your message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;