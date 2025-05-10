import styles from '../styles/Register.module.css'

export function Register() {
  return (
    <>
      <main className={styles.main}>
        <section id={styles['logo_class']}>
          <div className="logo">
            <img className={styles.img} src="icons/gamepad-solid.svg" alt="imagem poggers" />
          </div>
          <h1 className={styles.h1}>Registro</h1>
        </section>
        <section id={styles['placeholder_class']}>
          <div>
            <input className={styles.input} type="text" placeholder="Nome:" />
          </div>
          <div>
            <input className={styles.input} type="text" placeholder="Endereço:" />
          </div>
          <div>
            <input className={styles.input} type="tel" placeholder="Telefone:" />
          </div>
          <div>
            <input className={styles.input} type="email" placeholder="Email:" />
          </div>
          <div>
            <input className={styles.input} type="password" placeholder="Senha:" />
          </div>
          <div>
            <button id={styles['Cadastro_button']} type="submit">
              Cadastrar
            </button>
          </div>
          <p className={styles.p}>
            Já possui uma conta? <a className={styles.a} href="login">Faça login</a>
          </p>
        </section>
      </main>
    </>
  )
}
