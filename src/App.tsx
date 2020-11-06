import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Layout from './Layout'
import Routes from './routes/Routes'

import './App.css'
import './fontawesome'

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Layout>
          <Routes />
        </Layout>
      </BrowserRouter>
    </div>
  )
}

export default App
