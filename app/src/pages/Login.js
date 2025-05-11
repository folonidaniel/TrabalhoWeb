import { useNavigate } from "react-router"
import styles from '../styles/Login.module.css'

//TODO: passar pra esse component (usando props)
// a página para qual ele deve retornar após 'efetuar' o login
export function Login() {
  const navigation = useNavigate()

  function handleLogin(){
    sessionStorage.setItem("isLoggedIn", true)
    navigation("/")
  }

  return (
    <>
      <main className={styles.main}>
        <section id={styles['logo_class']}>
          <div className={styles.logo}>
            <img className={styles.img} src="icons/gamepad-solid.svg" alt="imagem poggers" />
          </div>
          <h1 className={styles.h1}>Login</h1>
        </section>
        <section id={styles['placeholder_class']}>
          <div>
            <input className={styles.input} type="text" placeholder="Email:" />
          </div>
          <div>
            <input className={styles.input} type="password" placeholder="Senha:" />
          </div>
          <div>
            <button id={styles['Login_button']} type="submit" onClick={handleLogin}>
              Entrar
            </button>
          </div>
          <p className={styles.p}>
            Ainda não tem uma conta? <a className={styles.a} href="/register">Cadastre-se</a>
          </p>
        </section>
      </main>
    </>
  );
}
