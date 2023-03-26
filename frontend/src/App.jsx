import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";

import ChatGPT from './ChatGPT/ChatGPT'
import Login from './Login';
import Profile from './Profile';

const amplifyConfig = {
    Auth: {
      mandatorySignIn: false,
      region: import.meta.env.VITE_APP_REGION,
      userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
      userPoolWebClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
      // identityPoolId: import.meta.env.VITE_APP_IDENTITY_POOL_ID,
    },
    API: {
      endpoints: [
        {
          name: "api",
          endpoint: import.meta.env.VITE_APP_API_URL,
          region: import.meta.env.VITE_APP_REGION,
        },
      ],
    },
  };
Amplify.configure(amplifyConfig);

export default function App() {

  return (
    <Authenticator.Provider>
        <div className="flex flex-col min-h-screen">
            <BrowserRouter>
                <nav className='px-7 h-16 flex flex-col justify-center bg-slate-400'>
                    <ul className='flex justify-between'>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/profile">Profile</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                    </ul>
                </nav>

                <main className='flex flex-col grow bg-slate-200'>
                    <Routes>
                        <Route path="/" element={<ChatGPT />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/about" element={<div className='m-auto'>About</div>} />
                    </Routes>
                </main>

                <footer className="flex justify-end bg-slate-400 pr-4 h-10">
                    <span className='flex flex-col justify-center font-bold text-slate-600'>Tony Kieling &copy; - 2023</span>
                </footer>
            </BrowserRouter>
        </div>    
    </Authenticator.Provider>
  )
}
