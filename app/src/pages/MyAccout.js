import { useNavigate } from "react-router"
import { useState, useEffect } from "react"
import styles from "../styles/MyAccount.module.css"
import Navbar from "../components/Navbar"
import Error from "../components/Error"
import Success from "../components/Success"
import { readLoggedUser, isValidEmail, isValidPhone, deleteLoggedUser, readUsers, updateLoggedUser, updateUsers } from "../Utils"
import Loading from "../components/Loading"
import FullPageError from "../components/FullPageError"

export function MyAccount() {
    const navigate = useNavigate()
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loggedUser, setLoggedUser] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect( () => {
        const fetchData = async () => {
            const fetchedUser = await readLoggedUser()
            if (fetchedUser == null){
                navigate("/login") 
                return;
            }
            setLoggedUser(fetchedUser)
            setIsLoaded(true)
        }
        fetchData().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })
    }, [])

    async function handleExit(event) {
        event.preventDefault()
        await deleteLoggedUser()
        navigate("/")
    }

    async function handleUpdate(event) {
        event.preventDefault()

        const inputs = Array.from(document.getElementsByTagName("input"))
        const emailElem = document.getElementsByTagName("input")[3]
        const phoneElem = document.getElementsByTagName("input")[2]

        let hasInvalidInput = false
        let errorMsg = ""
        if (!isValidEmail(emailElem.value)) {
            emailElem.className = styles.invalidInput
            hasInvalidInput = true
            errorMsg += "Email inválido"
        }
        if (!isValidPhone(phoneElem.value)) {
            phoneElem.className = styles.invalidInput
            if (hasInvalidInput) errorMsg += " e "
            errorMsg += "Telefone inválido"
            hasInvalidInput = true
        }
        if (hasInvalidInput) {
            setError(errorMsg)
            setTimeout(() => {
                emailElem.className = styles.input
                phoneElem.className = styles.input
                setError(null)
            }, 2000)
            return;
        }


        let users = await readUsers().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })
        if (users === null) users = []

        const updatedUser = {}
        inputs.forEach((input) => {
            if (input.value !== "") updatedUser[input.name] = input.value
            else updatedUser[input.name] = loggedUser[input.name]
        })
        await updateLoggedUser(updatedUser).catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        let updatedUsers = users.map((user) => {
            if (user.email === loggedUser.email) return updatedUser
            return user
        })
        await updateUsers(updatedUsers).catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        setSuccess("Dados da conta atualizados com sucesso!")
        setTimeout(() => {
            setSuccess(null)
        }, 2500)
    }
    
    if(!isLoaded){
        return (
            <>
                <Navbar/> 
                <Loading/>
            </>
        )
    } else if(error !== null){
        return (
            <FullPageError title={error.title} message={error.message}/>
        )
    }

    return (
        <>
            <Navbar />
            <div className={styles.titleContainer}><h1 className={styles.title}>Minha Conta</h1></div>
            <main className={styles.main}>
                {success !== null ? (
                    <Success message={success} />
                ) : (
                    <></>
                )}
                {error !== null ? (
                    <Error className="sus" message={error}/>
                ) : (
                    <></>
                )}
                <div className={styles.form}>
                    <label className={styles.label} htmlFor="name">Nome: </label>
                    <input
                        className={styles.input}
                        required
                        defaultValue={loggedUser.name}
                        name="name" type="text" />
                    <label className={styles.label} htmlFor="address">Endereço: </label>
                    <input
                        className={styles.input}
                        required
                        defaultValue={loggedUser.address}
                        name="address"
                        type="text" />
                    <label className={styles.label} htmlFor="phone">Telefone: </label>
                    <input
                        className={styles.input}
                        required
                        defaultValue={loggedUser.phone}
                        name="phone"
                        type="tel" />
                    <label className={styles.label} htmlFor="email">Email: </label>
                    <input className={styles.input}
                        required
                        defaultValue={loggedUser.email}
                        name="email"
                        type="text" />
                    <label className={styles.label} htmlFor="password">Senha: </label>
                    <input
                        className={styles.input}
                        name="password"
                        type="password" />
                    <div className={styles.buttonsContainer}>
                        <button
                            onClick={handleExit}
                            style={{ backgroundColor: "red" }}
                            className={styles.buttons}>Sair</button>
                        <button
                            onClick={handleUpdate}
                            style={{ backgroundColor: "#01257D" }}
                            className={styles.buttons}>Atualizar</button>
                    </div>
                </div>
            </main>
        </>
    )
}