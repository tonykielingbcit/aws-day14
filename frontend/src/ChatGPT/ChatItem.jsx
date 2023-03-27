import React, { useRef, useState } from 'react';
import { EditIcon, TrashIcon } from './Icons'; // Import the icons from a separate file
import { useAuthenticator } from "@aws-amplify/ui-react";


const ChatItem = ({ chat, selected, onSelect, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(chat.name);
  const inputRef = useRef(null);

  const { user } = useAuthenticator(context => [context.user]);

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
        // <div className="flex items-center cursor-pointer">
        <div className="flex w-full justify-between cursor-pointer">
            <div className='flex grow justify-between'>
                <h3 className="flex-grow font-semibold">{chat.name}</h3>
                <h3 className='italic mr-4'>{chat.username}</h3>
            </div>
            <div>
                <button onClick={toggleEditing} className="px-1 text-gray-600 hover:text-blue-500 hover:font-extrabold">
                    <EditIcon />
                </button>
                <button onClick={handleDelete} className=" text-gray-600 hover:text-red-500 hover:font-extrabold">
                {/* <button onClick={() => handleClick("delete")} className="px-1 ml-2 text-gray-600 hover:text-gray-800"> */}
                    <TrashIcon />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
