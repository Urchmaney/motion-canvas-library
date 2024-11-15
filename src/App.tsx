import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from './router'
import { PlayersProvider } from './contexts'

function App() {

  return (
    <>
      <PlayersProvider>
        <RouterProvider router={router} />
      </PlayersProvider>

    </>
  )
}

export default App
