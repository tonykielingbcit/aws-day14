import React, { useEffect, useState } from 'react';
import Message from './MessageItem';

const ChatWindow = ({chat}) => {
  // Replace the array with actual message data
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // fetch the messages
  }, [chat])


  const handleSend = async () => {
    // Implement sending the message here
   
      
    
    setInput('');
  };

  const handleMessageUpdate = async (id, content) => {
    // Implement updating the message here
    console.log(id, content)
  }

  const handleMessageDelete = async (id) => {
    // Implement deleting the message here
    console.log(id)
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
