import React, { useState, useEffect } from 'react';
import { Auth, API } from "aws-amplify";

import ChatItem from './ChatItem';
import NewChatButton from './NewChatButton';


const ChatList = ({ onSelect, selectedChat, onProcessing, onSetProcessing, onSetSelectedChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    onSetProcessing(true);
    
    (async () => {
        const getChats = await API.get("api", "/chats");
        setChats(getChats.message);
        onSetProcessing(false);
    })();
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
    console.log("name:: ", name)
    onSetProcessing(true);
    // const addingChat = await fetch(
    //   `${api_url}/newChat`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       name
    //     })
    //   }
    // ).then(res => res.json());
    const token = (await Auth.currentSession()).getAccessToken().getJwtToken();
    // console.log("token ", token)
    // const addingChat = await API.post("api", "/newChat", 
    //     { body: JSON.stringify({ name }) },
    //     {
    //         headers: {
    //             Authorization: `Bearer ${(await Auth.currentSession())
    //                 .getAccessToken()
    //                 .getJwtToken()}`,
    //             },
                
    //     }
    // );
    const addingChat = await API.post(
        "api",
        "/newChat",
        { 
            // body: JSON.stringify({ name }),
            body: { name: name },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
      );
    console.log("addingChat=== ", addingChat)

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
