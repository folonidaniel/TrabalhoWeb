import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Register } from "./pages/Register"
import { Login } from "./pages/Login"
import { ProductDetails } from "./pages/ProductDetails"
import { Cart } from "./pages/Cart"
import { AboutUs } from "./pages/AboutUs"
import { Search } from "./pages/Search"
import { MyAccount } from './pages/MyAccout';
import { Checkout } from './pages/Checkout';
import { Main } from "./pages/Main";
import {AdminCreateUser} from "./pages/AdminCreateUser";
import {AdminCreateProduct} from "./pages/AdminCreateProduct";
import {AdminEditProduct} from "./pages/AdminEditProduct";
import {AdminEditUser} from "./pages/AdminEditUser";
import {AdminMain} from "./pages/AdminMain";
import {AdminSearchProduct} from './pages/AdminSearchProduct';
import {AdminSearchUsers} from './pages/AdminSearchUsers';

function App() {
  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/product/:id" element={<ProductDetails/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/about-us" element={<AboutUs/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/my-account" element={<MyAccount/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/create-user" element={<AdminCreateUser/>}/>
        <Route path="/create-product" element={<AdminCreateProduct/>}/>
        <Route path="/edit-product" element={<AdminEditProduct/>}/>
        <Route path="/edit-user" element={<AdminEditUser/>}/>
        <Route path="/main-admin" element={<AdminMain/>}/>
        <Route path="/search-product-admin" element={<AdminSearchProduct/>}/>
        <Route path="/search-users-admin" element={<AdminSearchUsers/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
