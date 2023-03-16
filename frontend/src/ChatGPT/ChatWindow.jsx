import React, { useEffect, useState } from 'react';
import Message from './MessageItem';

const ChatWindow = ({chat}) => {
  const api_url = import.meta.env.VITE_API_URL;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');


  useEffect(() => {
    fetch(`${api_url}/messages/${chat.id}`)
      .then(res => res.json())
      .then(messages => setMessages(messages.message));
  }, [chat])

  

  const handleSend = async () => {
    if (!input || input.trim() === "") return;

    const addMessage = await fetch(
      `${api_url}/newMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chat.id,
          content: input
        })
      }
    ).then(res => res.json());
    
    setMessages([addMessage.message, ...messages]);
    setInput('');
  };

  
  
  const handleMessageUpdate = async (id, content) => {
    const updatingMessage = await fetch(
      `${api_url}/message`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          content
        })
      }
    ).then(res => res.json());
    
    const updatedMessages = messages.map(msg => msg.id === id ? { ...msg, content } : msg);
    setMessages(updatedMessages);
  }



  const handleMessageDelete = async (id) => {
    await fetch(
      `${api_url}/message/${id}`,
      { method: "DELETE" }
    );
    
    const updatedMessages = messages.filter(message => message.id !== id);
    setMessages(updatedMessages);
  }



  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        {messages.map((message) => (
          <Message key={message.id} message={message} onUpdate={handleMessageUpdate} onDelete={handleMessageDelete} />
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Type your message..."
          autoFocus
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
