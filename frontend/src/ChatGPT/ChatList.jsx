import { useState, useEffect } from 'react';
import { API } from "aws-amplify";
import { Storage } from 'aws-amplify';

import ChatItem from './ChatItem';
import NewChatButton from './NewChatButton';


const ChatList = ({ onSelect, selectedChat, onProcessing, onSetProcessing, onSetSelectedChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    onSetProcessing(true);
    
    (async () => {
        try {
            const getChats = await API.get("api", "/chats");

            if (getChats?.error === false)
                setChats(getChats.message);
            else
                throw (getChats.message);

        } catch(error) {
            alert(`Something bad happen, please try againg later.\n###ERROR:\n ${error.message || error}`);
        }
        onSetProcessing(false);
    })();
  }, []);



  const updateChat = async (id, newName) => {
    try {
        onSetProcessing(true);
    
        const updatingChat = await API.put(
            "api",
            "/chat",
            {
                body: {
                    id, 
                    name: newName
                },
                // headers: {
                //     Authorization: `Bearer ${(await Auth.currentSession())
                //       .getAccessToken()
                //       .getJwtToken()}`,
                //   },
            }
        );
    
        if (updatingChat.error) {
            alert("Sorry, this chat does not belong to you \ntherefore you CANNOT UPDATE IT.");
            onSetProcessing(false);
            return;
        }
        
        const updatedChats = chats.map(chat => chat.id === id ? { ...chat, name: newName } : chat);
        setChats(updatedChats);
    } catch(error) {
        alert(`Something bad happen, please try againg later.\n###ERROR:\n ${error.message || error}`);
    }
    onSetProcessing(false);
  };



  const deleteChat = async (id, name) => {
    try {
        const confirmDeletion = window.confirm(`Are you sure you want to delete \n chat '${name}' ?`);
    
        if (!confirmDeletion) return;
    
        const messagesInThisChat = await API.get("api", `/messages/${id}`);
        console.log("messagesInThisChat to be deleted (including images) - if logged and owner of it");
        console.log(messagesInThisChat);

        onSetProcessing(true);
        const deletingChat = await API.del(
            "api",
            `/chat/${id}`,
            // { 
            //     headers: {
            //         Authorization: `Bearer ${(await Auth.currentSession())
            //           .getAccessToken()
            //           .getJwtToken()}`,
            //       },
            // }
        );
        
        if (deletingChat.error) {
            alert("Sorry, this chat does not belong to you \ntherefore you CANNOT DELETE IT.");
            onSetProcessing(false);
            return;
        }


        // it deletes the images for the chat just deleted above
        const messages = messagesInThisChat.message;
        for(const message of messages)
            if (message.content_type === "image")
                await Storage.remove(message.content);
    

        const updatedChats = chats.filter(chat => chat.id !== id);
        setChats(updatedChats);
    } catch(error) {
        alert(`Something bad happen, please try againg later.\n###ERROR:\n ${error.message || error}`);
    }
    onSetProcessing(false);
    onSetSelectedChat(null);
  };


  
  const createChat = async name => {
    try {
        onSetProcessing(true);
        
        const addingChat = await API.post(
            "api",
            "/newChat",
            { 
                body: { name: name },
                // do NOT need this because we are going to work with IAM instead of JWT
                // headers: {
                //     Authorization: `Bearer ${(await Auth.currentSession())
                //       .getAccessToken()
                //       .getJwtToken()}`,
                //   },
            }
          );

        if (!addingChat.error)
            setChats([addingChat.message, ...chats]);
        else 
            throw (addingChat.message)
        
    } catch(error) {
        alert(`Something bad happen, please try againg later.\n###ERROR:\n ${error.message || error}`);
    }
    onSetProcessing(false);
  };


  return (
    <div className="overflow-y-auto">
        {(chats.length < 1)
            ?
                <div className='w-4/5 m-auto'>
                    <p className='text-center font-bold text-red-500 border-2 rounded-md my-8'>No Chats so far</p>
                </div>
            :
                chats.map(chat => (
                    <ChatItem selected={chat.id == selectedChat?.id} key={chat.id} chat={chat} 
                        onSelect={onSelect} onUpdate={updateChat} onDelete={deleteChat} />
                ))
        }

      <NewChatButton onCreate={createChat} onProcessing={onSetProcessing} processing={onProcessing} />
    </div>
  );
};

export default ChatList;
