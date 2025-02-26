import { useState } from 'react'

import SnakeGame from './Components/GameBoard'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<SnakeGame/>
    </>
  )
}

export default App
