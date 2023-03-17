import React, { useState, useEffect } from 'react';
import ChatItem from './ChatItem';
import NewChatButton from './NewChatButton';


const ChatList = ({ onSelect, selectedChat, onProcessing, onSetProcessing, onSetSelectedChat }) => {
  const api_url = import.meta.env.VITE_API_URL;
  const [chats, setChats] = useState([]);

  useEffect(() => {
    onSetProcessing(true);
    
    setTimeout(() => {
      fetch(`${api_url}/chats`)
        .then(res => res.json())
        .then(chats => setChats(chats.message))
        .then(onSetProcessing(false));
    }, 500);
  }, []);



  const updateChat = async (id, newName) => {
    onSetProcessing(true);
    const updatingChat = await fetch(
      `${api_url}/chat`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name: newName
        })
      }
    ).then(res => res.json());
    
    const updatedChats = chats.map(chat => chat.id === id ? { ...chat, name: newName } : chat);
    setChats(updatedChats);
    onSetProcessing(false);
  };



  const deleteChat = async (id, name) => {
    const confirmDeletion = window.confirm(`Are you sure you want to delete \n chat '${name}' ?`);

    if (!confirmDeletion) return;

    onSetProcessing(true);
    await fetch(
      `${api_url}/chat/${id}`,
      { method: "DELETE" }
    );
    
    const updatedChats = chats.filter(chat => chat.id !== id);
    setChats(updatedChats);
    onSetProcessing(false);
    onSetSelectedChat(null);
  };


  
  const createChat = async name => {
    onSetProcessing(true);
    const addingChat = await fetch(
      `${api_url}/newChat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name
        })
      }
    ).then(res => res.json());

    setChats([addingChat.message, ...chats]);
    onSetProcessing(false);
  };


  return (
    <div className="overflow-y-auto">
      {(!chats || chats.length < 1) &&
        <div className='w-4/5 m-auto'>
          <p className='text-center font-bold text-red-500 border-2 rounded-md my-8'>No Chats so far</p>
        </div>
      }
      {chats.map(chat => (
        <ChatItem selected={chat.id == selectedChat?.id} key={chat.id} chat={chat} 
            onSelect={onSelect} onUpdate={updateChat} onDelete={deleteChat} />
      ))}
      <NewChatButton onCreate={createChat} onProcessing={onSetProcessing} processing={onProcessing} />
    </div>
  );
};

export default ChatList;
