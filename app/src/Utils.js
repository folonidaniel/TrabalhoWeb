export function isValidEmail(email) {
    const regex = /^\S+@\S+\.\S+$/
    return regex.test(email)
}

export function isValidPhone(phone) {
    const regex = /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/
    return regex.test(phone)
}
