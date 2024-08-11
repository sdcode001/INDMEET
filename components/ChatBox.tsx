'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import  {io}  from 'socket.io-client'

//for locally use http://localhost:5000
const socket = io('https://indmeet-chat-server.onrender.com'); 

type ChatMessage = {
  roomId: string;
  user: string;
  message: string;
  time:string
};

type ChatBoxProps = {
  onClose: () => void;
  meetingId: string;  
};

const ChatBox: React.FC<ChatBoxProps> = ({ onClose, meetingId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isLoaded } = useUser();


  useEffect(() => {
    if (meetingId) {
      socket.emit('join_room', meetingId);
    }
  }, [meetingId]);


  useEffect(() => {
    // Scroll to the bottom of the chat when a new message is added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (!isLoaded || !user) return;

    socket.on('recieved_chat',(data)=>{
        setMessages([...messages, data]);
    })

  }, [socket, messages]);


  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const newChatMessage: ChatMessage = {
      roomId: meetingId,
      user: user?.fullName || "You", 
      message: newMessage,
      time:new Date(Date.now()).getHours()+":"+new Date(Date.now()).getMinutes()
    };

    socket.emit('send_message', newChatMessage);

    setMessages([...messages, newChatMessage]);
    setNewMessage('');
  };




  return (
    <div className="relative flex flex-col w-full h-full bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">ChatBox</h2>
        <button onClick={onClose} className="text-white hover:text-gray-400">
          Close
        </button>
      </div>
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg.roomId} className="mb-2">
            <span className="text-blue-500">{msg.user}: </span>
            <span className="text-white">{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow p-2 rounded-l-lg bg-gray-700 text-white focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 p-2 rounded-r-lg text-white hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
