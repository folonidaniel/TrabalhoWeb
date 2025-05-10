import styles from '../styles/login.module.css'

export function Login() {
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
            <button id={styles['Login_button']} type="submit">
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
