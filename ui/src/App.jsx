import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Graphs from './components/Graphs'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/graphs' element={<Graphs/>}/>
      </Routes>
    </HashRouter>
  )
}

export default App