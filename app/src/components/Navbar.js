import styles from '../styles/Navbar.module.css'

export default function Navbar() {
  const loggedUser = sessionStorage.getItem("loggedUser")
  
  return (
    <>
      <nav id={styles["navbar"]}>
        <a href="/" className={styles.logoContainer}> 
          <img id={styles["logo-icon"]} src="/icons/gamepad-solid.svg" alt="Logo"/>
        </a>
        <a href="/about-us" className={styles["nav-right-items"]}>
          Sobre Nós
        </a>

        {loggedUser === null ? (
          <>
            <a href="/login" className={styles["nav-right-items"]}>Entre</a>
            <a href="/register" className={styles["nav-right-items"]}>Cadastre-se</a>
            <img id={styles["menu-icon"]} src="/icons/bars-solid.svg" alt="Menu" />
          </>
        ) : (
          <>
            <a href="/my-account" className={styles["nav-right-items"]}>
              Minha Conta
            </a>
            <a href="/cart">
              <img id={styles["cart-icon"]} className={styles["nav-right-items"]} src="/icons/cart-shopping-solid.svg" alt="Carrinho"/>
            </a>
          </>
        )}
      </nav>
    </>
  );
}
