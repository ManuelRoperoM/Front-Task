import { useState } from 'react'
import {LoginForm} from './components/LoginForm'
import { AuthProvider } from './context/AuthContext';
import './App.css';
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import Tasks from './components/Tasks';

function App() {
  return (
    // <>
    //     <AuthProvider>
    //       <LoginForm />
    //     </AuthProvider>
    // </>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<LoginForm/>} />
          <Route path='tasks' element={<Tasks/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
