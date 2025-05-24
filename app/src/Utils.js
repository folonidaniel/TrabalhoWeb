import { useEffect, useState } from "react";

export function delay(ms){
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}

export async function readLoggedUser(){
    await delay(100)
    return JSON.parse(sessionStorage.getItem("loggedUser"))
}

export async function deleteLoggedUser(){
    await delay(100)
    sessionStorage.removeItem("loggedUser") 
}

export async function updateLoggedUser(updatedUser){
    await delay(100)
    sessionStorage.setItem("loggedUser", JSON.stringify(updatedUser))
}

export async function readUsers(){
    await delay(100)
    return JSON.parse(sessionStorage.getItem("users"))
}

export async function updateUsers(updatedUsers){
    await delay(100)
    sessionStorage.setItem("users", JSON.stringify(updatedUsers))
}
    
export async function readCart(){
    await delay(100)
    return JSON.parse(sessionStorage.getItem("cart"))
}
    
export async function updateCart(cart){
    await delay(100)
    sessionStorage.setItem("cart", JSON.stringify(cart))
}

export async function updateStock(product, newQuantity){
    await delay(100)
    //diminuir quantidade em estoque
}

export function isValidEmail(email) {
    const regex = /^\S+@\S+\.\S+$/
    return regex.test(email)
}

export function isValidPhone(phone) {
    const regex = /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/
    return regex.test(phone)
}

export function CheckForMobile() {
    const [width, setWidth] = useState(window.innerWidth);
    function handleWindowSizeChange () {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return (width <= 768);
}