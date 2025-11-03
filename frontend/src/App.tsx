import {BrowserRouter, Route, Routes} from 'react-router';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import {Toaster} from 'sonner';
import HomePage from './pages/HomePage';

function App() {

  return (
    <>
      <Toaster richColors/>
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route
            path='/signin'
            element={<SigninPage/>}
          />

          <Route
            path='/signup'
            element={<SignupPage/>}
          />
          {/* protected routes */}
          <Route
            path='/'
            element={<HomePage/>}
          />
          <Route
            path='/chat'
            element={<ChatPage/>}
          />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
