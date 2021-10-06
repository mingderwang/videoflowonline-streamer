import { useEffect, useState } from 'react'
import './App.css'
function App() {
  const makeAPICall = async () => {
    try {
      const response = await fetch('http://localhost:8080/cors', {
        mode: 'no-cors'
      })
      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {}, [])
  return (
    <div className='App'>
      <h1>React Cors Guide</h1>
    </div>
  )
}
export default App
