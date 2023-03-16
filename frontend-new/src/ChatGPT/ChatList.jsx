import React, { useState, useEffect } from 'react';
import ChatItem from './ChatItem';
import NewChatButton from './NewChatButton';

const ChatList = ({ onSelect, selectedChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // fetch the chats
  }, []);


  const updateChat = async (id, newName) => {
    // update the chat

    const updatedChats = chats.map((chat) =>
      chat.id === id ? { ...chat, name: newName } : chat
    );
    setChats(updatedChats);
  };

  const deleteChat = async (id) => {
    // delete the chat

    const updatedChats = chats.filter((chat) => chat.id !== id);
    setChats(updatedChats);
  };

  const createChat = async (name) => {
    // create the chat
  };

  return (
    <div className="overflow-y-auto">
      {chats.map((chat) => (
        <ChatItem selected={chat.id == selectedChat?.id} key={chat.id} chat={chat} onSelect={onSelect} onUpdate={updateChat} onDelete={deleteChat} />
      ))}
      <NewChatButton onCreate={createChat} />
    </div>
  );
};

export default ChatList;
