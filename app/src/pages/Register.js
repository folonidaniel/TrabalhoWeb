import styles from "../styles/Register.module.css"
import { useNavigate, useLocation, Link } from "react-router"
import { useState } from "react"
import SucessPopup from "../components/SuccessPopup"
import Error from "../components/Error"
import { isValidEmail, isValidPhone, readUsers, updateUsers } from "../Utils"
import FullPageError from "../components/FullPageError"

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const [validationError, setValidationError] = useState(null);
  const [requestError, setRequestError] = useState(null);
  const [hasFinished, setFinished] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()

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
      setValidationError(errorMsg)
      setTimeout(() => {
        emailElem.className = styles.input
        phoneElem.className = styles.input
        setValidationError(null)
      }, 2000)
      return
    }

    let newUser = {}
    inputs.forEach((input) => {
      newUser[input.name] = input.value
    })

    let users = await readUsers().catch(async () => {
          const error = {
              title: "Erro interno do servidor.",
              message: "Por favor, tente novamente."
          }
          setRequestError(error)
    })

    if (users === null) users = []
    await updateUsers([...users, newUser]).catch(async () => {
          const error = {
              title: "Erro interno do servidor.",
              message: "Por favor, tente novamente."
          }
          setRequestError(error)
    })


    setFinished(true)
    setTimeout(() => {
      navigate("/login", { state: location.state })
    }, 2000);
  }
  
  if(requestError !== null) return (<FullPageError title={requestError.title} message={requestError.message}/>)

  if (!hasFinished) {
    return (
      <>
        <form onSubmit={handleRegister} action="/create/user" method="POST" className={styles.main}>
          <section id={styles['logo_class']}>
            <div className="logo">
              <a href="/">
                <img className={styles.img} src="icons/gamepad-solid.svg" alt="imagem poggers" />
              </a>
            </div>
            <h1 className={styles.h1}>Cadastro</h1>
          </section>
          <section id={styles['placeholder_class']}>
            {validationError !== null ? (
              <Error message={validationError}/>
            ) : (
              <></>
            )}
            <div>
              <input className={styles.input} required name="name" type="text" placeholder="Nome:" />
            </div>
            <div>
              <input className={styles.input} required name="address" type="text" placeholder="Endereço:" />
            </div>
            <div>
              <input className={styles.input} required name="phone" type="text" placeholder="Telefone:" />
            </div>
            <div>
              <input className={styles.input} required name="email" type="text" placeholder="Email:" />
            </div>
            <div>
              <input className={styles.input} required name="password" type="password" placeholder="Senha:" />
            </div>
            <div>
              <button id={styles['Cadastro_button']} type="submit">
                Cadastrar
              </button>
            </div>
            <p className={styles.p}>
              Já possui uma conta? <Link to="/login" state={location.state} className={styles.a}>Faça login</Link>
            </p>
          </section>
        </form>
      </>
    )
  } else {
    return (
      <main className={styles.main}>
          <SucessPopup color="white" title="Cadastro realizado com sucesso!" msg="Por favor, faça login para começar suas compras" />
      </main>
    )
  }
}
