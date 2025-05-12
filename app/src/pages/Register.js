import styles from "../styles/Register.module.css"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useState } from "react"

export function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState(null);

  function isValidEmail(email) {
    const regex = /^\S+@\S+\.\S+$/
    return regex.test(email)
  }

  function isValidPhone(phone) {
    const regex = /(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/ 
    return regex.test(phone)
  }

  function handleRegister(e){
    e.preventDefault()

    const inputs = Array.from(document.getElementsByTagName("input"))
    const emailElem = document.getElementsByTagName("input")[3]
    const phoneElem = document.getElementsByTagName("input")[2]

    let hasInvalidInput = false
    let errorMsg = ""
    if(!isValidEmail(emailElem.value)){
      emailElem.className = styles.invalidInput
      hasInvalidInput = true
      errorMsg += "Email inválido"
    }
    if(!isValidPhone(phoneElem.value)){
      phoneElem.className = styles.invalidInput
      if(hasInvalidInput) errorMsg += " e "
      errorMsg += "Telefone inválido"
      hasInvalidInput = true
    }
    if(hasInvalidInput){
      setError(errorMsg)
      setTimeout( () => {
        emailElem.className = styles.input
        phoneElem.className = styles.input
        setError(null)
      }, 2000)
      return
    }

    let newUser = {}
    inputs.forEach( (input) => {
      newUser[input.name] = input.value
    })
    
    let users = JSON.parse(sessionStorage.getItem("users"))
    if(users === null) users = []
    sessionStorage.setItem("users", JSON.stringify([...users, newUser]))
    
    navigate("/login", { state: location.state })
  }

  return (
    <>
      <form onSubmit={handleRegister} action="/create/user" method="POST" className={styles.main}>
        <section id={styles['logo_class']}>
          <div className="logo">
            <img className={styles.img} src="icons/gamepad-solid.svg" alt="imagem poggers" />
          </div>
          <h1 className={styles.h1}>Registro</h1>
        </section>
        <section id={styles['placeholder_class']}>
          {error === null ? (
            <></>
          ) : (
            <div className={styles.errorContainer}>
              <h4>{error}</h4>
            </div>
          )}
          <div>
            <input className={styles.input} required name="name" type="text" placeholder="Nome:" />
          </div>
          <div>
            <input className={styles.input} required name="address" type="text" placeholder="Endereço:" />
          </div>
          <div>
            <input className={styles.input} required name="phone" type="tel" placeholder="Telefone:" />
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
}
