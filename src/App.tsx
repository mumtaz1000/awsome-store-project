import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Layout from './Layout'
import Routes from './routes/Routes'
import ModalContextProvider from './state/modal-context'

import './App.css'
import './fontawesome'

function App() {
  return (
    <ModalContextProvider>
      <BrowserRouter>
        <Layout>
          <Routes />
        </Layout>
      </BrowserRouter>
    </ModalContextProvider>
  )
}

export default App
