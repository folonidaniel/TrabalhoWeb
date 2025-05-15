import { useNavigate } from "react-router"
import { useState } from "react"
import styles from "../styles/MyAccount.module.css"
import Navbar from "../components/Navbar"
import SucessPopup from "../components/SuccessPopup"

export function MyAccount() {
    const navigate = useNavigate()
    const [hasFinished, setFinished] = useState(false)
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"))
    if (loggedUser === null) navigate("/login")

    function handleExit(event){
        event.preventDefault()
        sessionStorage.removeItem("loggedUser")
        navigate("/")
    }

    function handleUpdate(event) {
        event.preventDefault()
        let users = JSON.parse(sessionStorage.getItem("users"))
        if (users === null) users = []
        
        const inputs = Array.from(document.getElementsByTagName("input"))
        const updatedUser = {}
        inputs.forEach((input) => {
            if(input.value !== "") updatedUser[input.name] = input.value
            else updatedUser[input.name] = loggedUser[input.name]
        })
        sessionStorage.setItem("loggedUser", JSON.stringify(updatedUser))

        let updatedUsers = users.map((user) => {
            if (user.email === loggedUser.email) return updatedUser
            return user
        })
        sessionStorage.setItem("users", JSON.stringify(updatedUsers))
        setFinished(true)
        setTimeout(() => {
            navigate("/")
        }, 1500);
    }
    
    if (!hasFinished) {
        return (
            <>
                <Navbar />
                <div className={styles.titleContainer}><h1 className={styles.title}>Minha Conta</h1></div>
                <main className={styles.main}>
                    <form action="/update/user" method="POST" className={styles.form}>
                        <label className={styles.label} htmlFor="name">Nome: </label>
                        <input
                            className={styles.input}
                            required
                            defaultValue={Object.keys(loggedUser).length > 0 ? loggedUser.name : ""}
                            name="name" type="text" />
                        <label className={styles.label} htmlFor="address">Endereço: </label>
                        <input
                            className={styles.input}
                            required
                            defaultValue={Object.keys(loggedUser).length > 0 ? loggedUser.address : ""}
                            name="address"
                            type="text" />
                        <label className={styles.label} htmlFor="phone">Telefone: </label>
                        <input
                            className={styles.input}
                            required
                            defaultValue={Object.keys(loggedUser).length > 0 ? loggedUser.phone : ""}
                            name="phone"
                            type="tel" />
                        <label className={styles.label} htmlFor="email">Email: </label>
                        <input className={styles.input}
                            required
                            defaultValue={Object.keys(loggedUser).length > 0 ? loggedUser.email : ""}
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
                    </form>
                </main>
            </>
        )
    } else {
        return (
            <main className={styles.popupContainer}>
                <SucessPopup color="blue" title="Dados da conta atualizados com sucesso!" msg=""/>
            </main>
        )
    }
}