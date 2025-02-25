import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('process.env.REACT_APP_BACKEND_URL');

const Chat = () => {
    const [roomId, setRoomId] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        socket.on('receiveMessage', ({ message, timestamp, sender }) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { message, timestamp, sender },
            ]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    const joinRoom = () => {
        if (roomId) {
            socket.emit('joinRoom', { roomId });
            setMessages([]);
            setIsJoined(true);
        }
    };

    const sendMessage = () => {
        if (messageInput && roomId) {
            const messageData = { roomId, message: messageInput, sender: 'You' };

            socket.emit('sendMessage', messageData);
            setMessages((prevMessages) => [
                ...prevMessages,
                { message: messageInput, timestamp: new Date().toLocaleTimeString(), sender: 'You' },
            ]);
            setMessageInput('');
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div className="chat-container">
            <div className="header">
                <h5>Room ID: {roomId}</h5>
            </div>
            {!isJoined ? (
                <div className="join-room">
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter Room ID"
                    />
                    <button onClick={joinRoom}>Join Room</button>
                </div>
            ) : (
                <>
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender === 'You' ? 'sent' : 'received'}`}>
                                <span className="sender">{msg.sender}:</span>
                                <span className="content">{msg.message}</span>
                                <span className="timestamp">{msg.timestamp}</span>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button onClick={sendMessage}>Send</button>
                    <button onClick={clearChat}>Clear Chat</button>
                </>
            )}
        </div>
    );
};

export default Chat;
