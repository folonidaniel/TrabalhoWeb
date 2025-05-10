import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { Main } from './pages/Main'

function App() {
  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
