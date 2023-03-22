import ChatGPT from './ChatGPT/ChatGPT'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

export default function App() {

  return (
    <div className="flex flex-col min-h-screen">
        <BrowserRouter>
            <nav className='px-7 h-16 flex flex-col justify-center bg-slate-400'>
                <ul className='flex justify-between'>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                </ul>
            </nav>

            <main className='flex flex-col grow bg-slate-200'>
                <Routes>
                <Route path="/" element={<ChatGPT />} />
                <Route path="/about" element={<div className='m-auto'>About</div>} />
                </Routes>
            </main>

            <footer class="flex justify-end bg-slate-400 pr-4 h-10">
                <span className='flex flex-col justify-center font-bold text-slate-600'>Tony Kieling &copy; - 2023</span>
            </footer>
        </BrowserRouter>

    </div>
  )
}
