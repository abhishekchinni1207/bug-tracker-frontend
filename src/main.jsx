import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

import AuthProvider from './context/AuthProvider'
import ProjectProvider from './context/ProjectProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <ProjectProvider>
      
        <App />
       
      </ProjectProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
