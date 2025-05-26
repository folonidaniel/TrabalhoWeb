import { useNavigate, useLocation, Link } from "react-router";
import { useState } from "react";
import styles from "../styles/Login.module.css";
import { readUsers, updateLoggedUser } from "../Utils";
import FullPageError from "../components/FullPageError";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [validationError, setValidationError] = useState(null);
  const [requestError, setRequestError] = useState(null)

  function isValidEmail(email) {
    const regex = /^\S+@\S+\.\S+$/
    return regex.test(email)
  }

  async function handleLogin(e) {
    e.preventDefault();

    const emailElem = document.getElementsByTagName("input")[0]
    const email = emailElem.value
    const password = document.getElementsByTagName("input")[1].value

    if (!isValidEmail(email)) {
      emailElem.className = styles.invalidInput
      setValidationError("Email inválido")
      setTimeout(() => {
        emailElem.className = styles.input
        setValidationError(null)
      }, 2000)
      return
    }

    let users = await readUsers()

    if (users === null) users = [];
    const userFound = users.find(
      (user) => user.email === email && user.password === password
    );

    if (userFound === undefined) {
      setValidationError("Email e/ou senha incorretos");
      setTimeout(() => setValidationError(null), 2000);
      return;
    }

    await updateLoggedUser(userFound).catch(async () => {
      const error = {
        title: "Erro interno do servidor.",
        message: "Por favor, tente novamente."
      }
      setRequestError(error)
    })

    if (location.state === null) navigate("/");
    else navigate(location.state);
  }
  
  if(requestError != null) return (<FullPageError title={requestError.title} message={requestError.message}/>)

  return (
    <>
      <form aria-label="form" onSubmit={ handleLogin } className={styles.main}>
        <section id={styles["logo_class"]}>
          <div className={styles.logo}>
            <a href="/">
              <img
                className={styles.img}
                src="icons/gamepad-solid.svg"
                alt="imagem poggers"
              />
            </a>
          </div>
          <h1 className={styles.h1}>Login</h1>
        </section>
        <section id={styles["placeholder_class"]}>
          {validationError === null ? (
            <></>
          ) : (
            <div className={styles.errorContainer}>
              <h4>{validationError}</h4>
            </div>
          )}
          <div>
            <input
              className={styles.input}
              required
              name="email"
              type="text"
              placeholder="Email:"
            />
          </div>
          <div>
            <input
              className={styles.input}
              required
              name="password"
              type="password"
              placeholder="Senha:"
            />
          </div>
          <div>
            <button id={styles["Login_button"]} type="submit">
              Entrar
            </button>
          </div>
          <p className={styles.p}>
            Ainda não tem uma conta?{" "}
            <Link to="/register" state={location.state} className={styles.a}>
              Cadastre-se
            </Link>
          </p>
        </section>
      </form>
    </>
  );
}
