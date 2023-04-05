import React, { useRef, useState } from 'react';
import { TrashIcon } from './Icons'; // Import the icons from a separate file
import { useAuthenticator } from "@aws-amplify/ui-react";
import { API } from "aws-amplify";


const ChatItem = ({ chat, selected, onSelect, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(chat.name);
  const inputRef = useRef(null);

  const { user } = useAuthenticator(context => [context.user]);
  const userIdentityId = user && API.Credentials._identityId;

  const handleUpdate = () => {
    if (!user) {
        alert("Login first, please");
        return;
    }

    onUpdate(chat.id, name);
    setIsEditing(false);
  };


  const handleDelete = event => {
    event.stopPropagation(); // Prevent the chat from being selected
    if (!user) {
        alert("Login first, please");
        return;
    }
    
    onDelete(chat.id, chat.name);
  };


  const handleSelect = () => {
    if (!isEditing) {
      onSelect(chat);
    }
  };


  const toggleEditing = event => {
    event.stopPropagation(); // Prevent the chat from being selected
    if (!user) {
        alert("Login first, please");
        return;
    }
    setIsEditing((prev) => !prev);
  };


  const handleEnter = ev => {
    if (ev.key === "Enter")
      handleUpdate();
  }


  // while we are not able to get the cognito username:
  const shortenName = word => {
    const wordLength = word.length;
    if (wordLength > 9) {
        let tempName = "";
        for (let i = 0; i < wordLength; i++) {
            if (i < 4) {
                tempName += word[i];
                continue;
            }
            if (i < 5)
                tempName += "..."
            if (i > (wordLength - 5)) {
                tempName += word[i];
                continue;
            }
        }
        return tempName;
    }
    return word;
  }


  return (
    <div className={`p-2 my-1 border-2 rounded-md hover:bg-lime-200 ${selected ? "bg-lime-200" : ""}`} onClick={handleSelect}>
      {isEditing ? (
        <div className="flex">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-grow p-1 border rounded"
            onKeyDown={handleEnter}
            ref={inputRef}
            autoFocus
          />
          <button onClick={handleUpdate} className="ml-2 px-2 py-1 bg-green-500 text-white font-semibold rounded">
            Save
          </button>
          <button onClick={toggleEditing} className="ml-2 px-2 py-1 bg-red-500 text-white font-semibold rounded">
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex w-full justify-between cursor-pointer">
            <div className='flex grow justify-between'>
                <h3 className="flex-grow font-semibold">{chat.name}</h3>
                <h3 className='italic mr-4' 
                    title={userIdentityId === chat.username ? "I am logged  \\o/" : "User not logged"}>
                    {userIdentityId === chat.username ? user.username : shortenName(chat.username)}
                </h3>
            </div>
            <div className='flex'>
                <button onClick={toggleEditing} title='Edit Chat name'
                    className="px-1 text-gray-600 hover:text-blue-500 hover:font-extrabold"
                >
                    <i className='fas fa-edit font-[48px] text-blue-500 hover:text-blue-800' />
                </button>
                <button onClick={handleDelete} title='Delete this Chat and all its messages'
                    className="text-red-500 hover:text-red-800 hover:font-extrabold"
                >
                    <TrashIcon />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
