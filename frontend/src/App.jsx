import { useEffect } from 'react';
import ChatGPT from './ChatGPT/ChatGPT'

export default function App() {
  // const api_url = import.meta.env.VITE_API_URL || "should be an URL..";

  // useEffect(() => {
  //   fetch(`${api_url}/chats`)
  //     .then(res => res.json())
  //     .then(console.log);
  // }, []);

  return (
    <ChatGPT></ChatGPT>
  )
}
// import { useState, useEffect } from 'react'
// import './App.css'

// function App() {
//   const api_url = import.meta.env.VITE_API_URL || "should be an URL..";
//   const [message, setMessage] = useState("processing...");
//   useEffect(() => {
//     fetch(`${api_url}/test/main`)
//             .then(res => res.json())
//             .then(r => {
//               setMessage(r.message);
//               console.log("tempMessage: ", r);
//             })
//             .catch(er => setMessage(er));
//     console.log("test " + api_url)
//   }, []);
//   return (
//     <div className="App">
//       <h1>Vite + React - TK</h1>
//       <h3 style={{color: "lime"}}>{api_url}</h3>
//       <div className="card">
//         <h3 style={{color: "blue"}}>{message}</h3>
//       </div>

//     </div>
//   )
// }

// export default App
