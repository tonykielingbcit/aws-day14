import React, { useEffect, useRef, useState } from 'react';
import Message from './MessageItem';

const ChatWindow = ({chat, onProcessing, onSetProcessing }) => {
  const api_url = import.meta.env.VITE_API_URL;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    onSetProcessing(true);
    fetch(`${api_url}/messages/${chat.id}`)
      .then(res => res.json())
      .then(messages => setMessages(messages.message))
      .then(onSetProcessing(false));

  }, [chat])

  

  const handleSend = async () => {
    onSetProcessing(true);
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
    onSetProcessing(false);
    inputRef.current.focus();
  };

  
  
  const handleMessageUpdate = async (id, content) => {
    onSetProcessing(true);
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
    onSetProcessing(false);
  }


  const handleMessageDelete = async (id) => {
    onSetProcessing(true);
    await fetch(
      `${api_url}/message/${id}`,
      { method: "DELETE" }
    );
    
    const updatedMessages = messages.filter(message => message.id !== id);
    setMessages(updatedMessages);
    onSetProcessing(false);
    inputRef.current.focus();
  }


  const handleEnter = ev => {
    if (ev.key === "Enter") handleSend();
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
          ref={inputRef}
          onKeyDown={handleEnter}
          autoFocus
        />
        <button
          onClick={handleSend}
          className={`ml-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded ${onProcessing ? "bg-orange-400" : ""}`}
          disabled={onProcessing}
        >
          {onProcessing ? "processing..." : "Send"}
          {/* Send */}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
