import { useEffect, useRef, useState } from 'react';
import Message from './MessageItem';
import { Auth, API } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Storage } from 'aws-amplify';


const ChatWindow = ({chat, onProcessing, onSetProcessing }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const [file, setFile] = useState(null);

  
    const { user } = useAuthenticator((context) => [context.user]);
  
    useEffect(() => {
        onSetProcessing(true);
      
        // console.log("getting messages")
        try {
            (async () => {
                    const getMessages = await API.get("api", `/messages/${chat.id}`);
                    const messages = getMessages.message;
                    for(const message of messages) {
                        if (message.content_type === "image")
                        // video at 2:27
                            message.url = await Storage.get(message.content, {
                                identityId: message.user_id
                            });
                    }
                    // setMessages(getMessages.message);
                    setMessages(messages);
                    console.log("tempMessages= ", getMessages, messages)
                })();
            } catch (error) {
                alert(`Something bad happen, please try againg later.\n###ERROR:\n ${error.message || error}`);
                
            } finally {
                onSetProcessing(false);
            }
    }, [chat]);


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }


const handleSend = async () => {
    if (!file && (!input || input.trim()) === "") {
        inputRef.current.focus();
        return;
    }
    
    if (!user)
        return alert("Login first, please");

    onSetProcessing(true);
console.log("file::::::::;;; ", file)
    if (file) {
        try {
            const s3Options = {
                contentType: file.type,
                progressCallback(progress) {
                    console.log(`Uploaded: ${progress.loaded/progress.total}`);;
                },
            };
            const uniqueName = `${Date.now()}-${file.name}`;
            await Storage.put(uniqueName, file, s3Options);
            console.log('File uploaded successfully!');
            const addingMessage = await API.post(
                "api",
                "/newMessage",
                {
                    body: { 
                        chatId: chat.id,
                        content: uniqueName,
                        content_type: "image"
                    }
                }
            );
            const tempMessage = addingMessage.message;
            tempMessage.url = await Storage.get(tempMessage.content, {
                identityId: tempMessage.user_id
            });
            
    console.log("tempMessage::::: ", tempMessage)

            setMessages([tempMessage, ...messages])
        } catch (error) {
            console.log('Error uploading file:', error);
            alert(`Something bad happen, please try againg later.\n###ERROR:\n ${error.message || error}`);    
        } finally {
            setFile(null);
        }
    } else {
        try {
            const addingMessage = await API.post(
                "api",
                "/newMessage",
                {
                    body: { 
                        chatId: chat.id,
                        content: input,
                        content_type: "text"
                     }
                }
            );
        
            if (addingMessage.error) {
                alert("Sorry, this chat does not belong to you \ntherefore you CANNOT ADD MESSAGES TO IT.");
                onSetProcessing(false);
                return false;
            }
            
            setMessages([addingMessage.message, ...messages]);
            setInput('');
        } catch(error) {
            alert(`Something bad happen, please try againg later.\n###ERROR:\n ${error.message || error}`);    
        }
    }

    onSetProcessing(false);
    inputRef.current.focus();
  };

  
  
  const handleMessageUpdate = async (id, content) => {
    onSetProcessing(true);
    const updatingMessage = await API.put(
        "api",
        "/message",
        {
            body: { 
                chatId: id,
                content
             }
        }
    );

    if (updatingMessage.error) {
        alert("Sorry, this chat does not belong to you \ntherefore you CANNOT UPDATE ITS MESSAGES.");
        onSetProcessing(false);
        return false;
    }
    
    const updatedMessages = messages.map(msg => msg.id === id ? { ...msg, content } : msg);
    setMessages(updatedMessages);
    onSetProcessing(false);
    return true;
  }


  const handleMessageDelete = async (id) => {
    onSetProcessing(true);

    const deletingMessage = await API.del(
        "api",
        `/message/${id}`
    );

    if (deletingMessage.error) {
        alert("Sorry, this chat does not belong to you \ntherefore you CANNOT DELETE ITS MESSAGES.");
        onSetProcessing(false);
        return false;
    }
    
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

        <input type="file" onChange={handleFileChange} />

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
