import React, { useRef, useState } from 'react';
import { EditIcon, TrashIcon } from './Icons'; // Import the icons from a separate file

const ChatItem = ({ chat, selected, onSelect, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(chat.name);
  const inputRef = useRef(null);


  const handleUpdate = () => {
    onUpdate(chat.id, name);
    setIsEditing(false);
  };


  const handleDelete = event => {
    event.stopPropagation(); // Prevent the chat from being selected
    onDelete(chat.id, chat.name);
  };


  const handleSelect = () => {
    if (!isEditing) {
      onSelect(chat);
    }
  };


  const toggleEditing = event => {
    event.stopPropagation(); // Prevent the chat from being selected
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
        <div className="flex items-center cursor-pointer">
          <h3 className="flex-grow font-semibold">{chat.name}</h3>
          <button onClick={toggleEditing} className="px-1 text-gray-600 hover:text-gray-800">
            <EditIcon />
          </button>
          <button onClick={handleDelete} className="px-1 ml-2 text-gray-600 hover:text-gray-800">
            <TrashIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
