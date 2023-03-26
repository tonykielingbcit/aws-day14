import React, { useEffect, useRef, useState } from 'react';
import Message from './MessageItem';
import { Auth, API } from "aws-amplify";


const ChatWindow = ({chat, onProcessing, onSetProcessing }) => {
  const api_url = import.meta.env.VITE_API_URL;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    onSetProcessing(true);
    
    (async () => {
        const getMessages = await API.get("api", `/messages/${chat.id}`);
        setMessages(getMessages.message);
        onSetProcessing(false);
    })();

    (async () => {
        const token = (await Auth.currentSession()).getAccessToken().getJwtToken();
        setToken(token);
    })();
  }, [chat]);

  

  const handleSend = async () => {
    onSetProcessing(true);
    if (!input || input.trim() === "") return;

    const addingMessage = await API.post(
        "api",
        "/newMessage",
        {
            body: { 
                chatId: chat.id,
                content: input
             },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
      );
    
    setMessages([addingMessage.message, ...messages]);
    setInput('');
    onSetProcessing(false);
    inputRef.current.focus();
  };

  
  
  const handleMessageUpdate = async (id, content) => {
    onSetProcessing(true);
    
    await API.put(
        "api",
        "/message",
        {
            body: { 
                chatId: id,
                content
             },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
      );
    
    const updatedMessages = messages.map(msg => msg.id === id ? { ...msg, content } : msg);
    setMessages(updatedMessages);
    onSetProcessing(false);
  }


  const handleMessageDelete = async (id) => {
    onSetProcessing(true);

    await API.del(
        "api",
        `/message/${id}`,
        { 
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
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
