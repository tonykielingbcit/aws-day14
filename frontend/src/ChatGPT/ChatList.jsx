import React, { useState, useEffect } from 'react';
import { Auth, API } from "aws-amplify";

import ChatItem from './ChatItem';
import NewChatButton from './NewChatButton';


const ChatList = ({ onSelect, selectedChat, onProcessing, onSetProcessing, onSetSelectedChat }) => {
  const [chats, setChats] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    onSetProcessing(true);
    
    (async () => {
        const getChats = await API.get("api", "/chats");
        setChats(getChats.message);
        onSetProcessing(false);
    })();

    (async () => {
        const token = (await Auth.currentSession()).getAccessToken().getJwtToken();
        setToken(token);
    })();
  }, []);



  const updateChat = async (id, newName) => {
    onSetProcessing(true);

    await API.put(
        "api",
        "/chat",
        {
            body: {
                id, 
                name: newName
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
      );
    
    const updatedChats = chats.map(chat => chat.id === id ? { ...chat, name: newName } : chat);
    setChats(updatedChats);
    onSetProcessing(false);
  };



  const deleteChat = async (id, name) => {
    const confirmDeletion = window.confirm(`Are you sure you want to delete \n chat '${name}' ?`);

    if (!confirmDeletion) return;

    onSetProcessing(true);
    await API.del(
        "api",
        `/chat/${id}`,
        { 
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
      );
    
    const updatedChats = chats.filter(chat => chat.id !== id);
    setChats(updatedChats);
    onSetProcessing(false);
    onSetSelectedChat(null);
  };


  
  const createChat = async name => {
    onSetProcessing(true);
    
    const addingChat = await API.post(
        "api",
        "/newChat",
        { 
            body: { name: name },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
      );

    setChats([addingChat.message, ...chats]);
    onSetProcessing(false);
  };


  return (
    <div className="overflow-y-auto">
      {(!chats || chats?.length < 1) &&
        <div className='w-4/5 m-auto'>
          <p className='text-center font-bold text-red-500 border-2 rounded-md my-8'>No Chats so far</p>
        </div>
      }
      {chats?.length > 0 && chats.map(chat => (
        <ChatItem selected={chat.id == selectedChat?.id} key={chat.id} chat={chat} 
            onSelect={onSelect} onUpdate={updateChat} onDelete={deleteChat} />
      ))}
      <NewChatButton onCreate={createChat} onProcessing={onSetProcessing} processing={onProcessing} />
    </div>
  );
};

export default ChatList;
