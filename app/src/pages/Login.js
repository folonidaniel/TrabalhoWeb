import { useNavigate, useLocation, Link } from "react-router";
import { useState } from "react";
import styles from "../styles/Login.module.css";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  
  function isValidEmail(email) {
    const regex = /^\S+@\S+\.\S+$/
    return regex.test(email)
  }

  function handleLogin(e) {
    e.preventDefault();

    const emailElem = document.getElementsByTagName("input")[0]
    const email = emailElem.value
    const password = document.getElementsByTagName("input")[1].value

    if(!isValidEmail(email)){
      emailElem.className = styles.invalidInput
      setError("Email inválido")
      setTimeout( () => {
        emailElem.className = styles.input
        setError(null)
      }, 2000)
      return
    }

    let users = JSON.parse(sessionStorage.getItem("users"));

    if (users === null) users = [];
    const userFound = users.find(
      (user) => user.email === email && user.password === password
    );

    if (userFound === undefined) {
      setError("Email e/ou senha incorretos");
      setTimeout(() => setError(null), 2000);
      return;
    }

    sessionStorage.setItem("loggedUser", JSON.stringify(userFound));
    if (location.state === null) navigate("/");
    else navigate(location.state);
  }

  return (
    <>
      <form onSubmit={handleLogin} className={styles.main}>
        <section id={styles["logo_class"]}>
          <div className={styles.logo}>
            <img
              className={styles.img}
              src="icons/gamepad-solid.svg"
              alt="imagem poggers"
            />
          </div>
          <h1 className={styles.h1}>Login</h1>
        </section>
        <section id={styles["placeholder_class"]}>
          {error === null ? (
            <></>
          ) : (
            <div className={styles.errorContainer}>
              <h4>{error}</h4>
            </div>
          )}
          <div>
            <input
              className={styles.input}
              required
              type="text"
              placeholder="Email:"
            />
          </div>
          <div>
            <input
              className={styles.input}
              required
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
