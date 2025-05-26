// Importa hooks e funções utilitárias necessárias
import { useNavigate } from "react-router"// Hook para navegação programática
import { useState, useEffect } from "react"
import styles from "../styles/MyAccount.module.css"
import Navbar from "../components/Navbar"
import Error from "../components/Error"
import Success from "../components/Success"
import { readLoggedUser, isValidEmail, isValidPhone, deleteLoggedUser, readUsers, updateLoggedUser, updateUsers } from "../Utils"
import Loading from "../components/Loading"
import FullPageError from "../components/FullPageError"

// Componente funcional para a página de Minha Conta
export default function MyAccount() {
    const navigate = useNavigate() //Hook para redirecionamento
    const [requestError, setRequestError] = useState(null);
    const [validationError, setValidationError] = useState(null);
    // Estados para mensagens de erro, sucesso, usuário logado e carregamento
    const [success, setSuccess] = useState(null);
    const [loggedUser, setLoggedUser] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false);

    // Efeito executado uma vez na montagem do componente
    useEffect( () => {
        const fetchData = async () => {
            const fetchedUser = await readLoggedUser()// Lê usuário logado
            if (fetchedUser == null){
                navigate("/login")// Se não há usuário logado, redireciona para login
                return;
            }
            setLoggedUser(fetchedUser)// Atualiza estado com o usuário logado
            setIsLoaded(true)// Marca como carregado
        }

        // Executa e trata erro na requisição
        fetchData().catch(async (err) => {
            console.log(err)
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setRequestError(error)
        })
    }, [])

    // Função chamada ao clicar no botão "Sair"
    async function handleExit(event) {
        event.preventDefault()
        await deleteLoggedUser()// Remove usuário logado do armazenamento
        navigate("/") // Redireciona para home
    }

    // Função chamada ao clicar no botão "Atualizar"
    async function handleUpdate(event) {
        event.preventDefault()

        // Pega todos os inputs do formulário
        const inputs = Array.from(document.getElementsByTagName("input"))
        const emailElem = document.getElementsByTagName("input")[3]
        const phoneElem = document.getElementsByTagName("input")[2]

        let hasInvalidInput = false
        let errorMsg = ""

        // Validação do email
        if (!isValidEmail(emailElem.value)) {
            emailElem.className = styles.invalidInput
            hasInvalidInput = true
            errorMsg += "Email inválido"
        }

        // Validação do telefone
        if (!isValidPhone(phoneElem.value)) {
            phoneElem.className = styles.invalidInput
            if (hasInvalidInput) errorMsg += " e "
            errorMsg += "Telefone inválido"
            hasInvalidInput = true
        }

        // Se houver input inválido, exibe erro e remove estilo após 2s
        if (hasInvalidInput) {
            setValidationError(errorMsg)
            setTimeout(() => {
                emailElem.className = styles.input
                phoneElem.className = styles.input
                setValidationError(null)
            }, 2000)
            return;
        }

        // Busca lista de usuários
        let users = await readUsers().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setRequestError(error)
        })
        if (users === null) users = []

        // Cria objeto atualizado com os valores preenchidos ou antigos
        const updatedUser = {}
        inputs.forEach((input) => {
            if (input.value !== "") updatedUser[input.name] = input.value
            else updatedUser[input.name] = loggedUser[input.name]
        })
        // Atualiza o usuário logado
        await updateLoggedUser(updatedUser).catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setRequestError(error)
        })

        // Atualiza a lista de usuários
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
            setRequestError(error)
        })

        // Mostra mensagem de sucesso temporária
        setSuccess("Dados da conta atualizados com sucesso!")
        setTimeout(() => {
            setSuccess(null)
        }, 2500)
    }
    
    // Enquanto não carregar, mostra Loading
    if(!isLoaded){
        return (
            <>
                <Navbar/> 
                <Loading/>
            </>
        )
    // Em caso de erro, mostra tela de erro completa
    } else if(requestError !== null){
        return (
            <FullPageError title={requestError.title} message={requestError.message}/>
        )
    }

    // Renderização principal da página de Minha Conta
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
                {validationError !== null ? (
                    <Error className="sus" message={validationError}/>
                ) : (
                    <></>
                )}
                {/* Campos do formulário pré-preenchidos com dados do usuário */}
                <div className={styles.form}>
                    <label className={styles.label} htmlFor="name">Nome: </label>
                    <input
                        id="name"
                        className={styles.input}
                        required
                        defaultValue={loggedUser.name}
                        name="name" type="text" />
                    <label className={styles.label} htmlFor="address">Endereço: </label>
                    <input
                        id="address"
                        className={styles.input}
                        required
                        defaultValue={loggedUser.address}
                        name="address"
                        type="text" />
                    <label className={styles.label} htmlFor="phone">Telefone: </label>
                    <input
                        id="phone"
                        className={styles.input}
                        required
                        defaultValue={loggedUser.phone}
                        name="phone"
                        type="tel" />
                    <label className={styles.label} htmlFor="email">Email: </label>
                    <input 
                        id="email"
                        className={styles.input}
                        required
                        defaultValue={loggedUser.email}
                        name="email"
                        type="text" />
                    <label className={styles.label} htmlFor="password">Senha: </label>
                    <input
                        id="password"
                        className={styles.input}
                        name="password"
                        type="password" />
                        
                    {/* Botões de sair e atualizar */}
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