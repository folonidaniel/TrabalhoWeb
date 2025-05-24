import styles from '../styles/Navbar.module.css'
import { useState } from "react"


export default function Navbar(props) {
  const [showSidebar, setShowSidebar] = useState(false)
  const loggedUser = sessionStorage.getItem("loggedUser")

  return (
    <>
      <nav id={styles["navbar"]}>
        <a href="/" className={styles.logoContainer}>
          <img id={styles["logo-icon"]} src="/icons/gamepad-solid.svg" alt="Logo" />
        </a>
        <a href="/about-us" className={styles["nav-right-items"]}>
          Sobre Nós
        </a>

        {loggedUser === null ? (
          <>
            <a href="/login" className={styles["nav-right-items"]}>Entre</a>
            <a href="/register" className={styles["nav-right-items"]}>Cadastre-se</a>
          </>
        ) : (
          <>
            <a href="/my-account" className={styles["nav-right-items"]}>
              Minha Conta
            </a>
            <a href="/cart">
              <img id={styles["cart-icon"]} className={styles["nav-right-items"]} src="/icons/cart-shopping-solid.svg" alt="Carrinho" />
            </a>
          </>
        )}
        <img onClick={() => setShowSidebar(!showSidebar)} id={styles["menu-icon"]} src="/icons/bars-solid.svg" alt="Menu" />
      </nav>
      {showSidebar ? (
        <div className={styles.sidebar}>
          <img id={styles["closeButton"]} className={styles.sidebarIcons} src="/icons/xmark-solid.svg" onClick={() => setShowSidebar(!showSidebar)} />
          <a href="/about-us" className={styles.sidebarItems}>
            Sobre Nós
          </a>
          {loggedUser === null ? (
            <>
              <a href="/login" className={styles.sidebarItems}>Entre</a>
              <a href="/register" className={styles.sidebarItems}>Cadastre-se</a>
            </>
          ) : (
            <>
              <a href="/my-account" className={styles.sidebarItems}>
                Minha Conta
              </a>
              <a href="/cart">
                <img style={{marginTop: "25px"}} id={styles["cart-icon"]} className={styles.sidebarIcons} src="/icons/cart-shopping-solid.svg" alt="Carrinho" />
              </a>
            </>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
