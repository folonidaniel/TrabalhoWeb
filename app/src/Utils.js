import { useEffect, useState } from "react";


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