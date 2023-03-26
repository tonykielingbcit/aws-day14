import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'
import AppAuthProvider from "./AppAuthProvider.jsx";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppAuthProvider />
    {/* <App /> */}
  </React.StrictMode>,
)
