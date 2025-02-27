import Home from './Components/Home/Home'
import SnakeGame from './Components/GameBoard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
function App() {

  return (
    <>
    <Router>
      <Routes>
      <Route path='/' element={<Home />} />
        <Route path='/game' element={<SnakeGame />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
