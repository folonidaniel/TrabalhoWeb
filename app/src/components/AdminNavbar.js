import styles from '../styles/AdminNavbar.module.css'
import { useState } from "react"


export default function AdminNavbar(props) {
  const [showSidebar, setShowSidebar] = useState(false)
  
  return (
    <>
      <nav id={styles["navbar"]}>
        <a href="/main-admin" className={styles.logoContainer}>
          <img id={styles["logo-icon"]} src="/icons/gamepad-solid.svg" alt="Logo" />
        </a>
        <div className={styles.dropdownContainer}>
          <button className={styles.dropdownMenu}> Usuários▼ </button>
          <div className={styles.dropdownItems}>
            <a className={styles.links} href="/search-users-admin">Editar Usuários</a>
            <br/>
            <a className={styles.links} href="/create-user">Criar Usuários</a>
          </div>
        </div>

        <div className={styles.dropdownContainer}>
          <button className={styles.dropdownMenu}> Produtos▼ </button>
          <div className={styles.dropdownItems}>
            <a className={styles.links} href="/search-products-admin">Editar Produtos</a>
            <br/>
            <a className={styles.links} href="/create-product">Criar Produtos</a>
          </div>
        </div>
        <img onClick={() => setShowSidebar(!showSidebar)} id={styles["menu-icon"]} src="/icons/bars-solid.svg" alt="Menu" />
      </nav>
      {showSidebar ? (
        <div className={styles.sidebar}>
          <img id={styles["closeButton"]} className={styles.sidebarIcons} src="/icons/xmark-solid.svg" onClick={() => setShowSidebar(!showSidebar)} />
          <a href="/search-products-admin" className={styles.sidebarItems}>
              Editar Produtos
          </a>
          <a href="/create-product" className={styles.sidebarItems}>
              Criar Produtos
          </a>
          <a href="/search-users-admin" className={styles.sidebarItems}>
              Editar Usuários
          </a>
          <a href="/create-user" className={styles.sidebarItems}>
              Criar Usuários
          </a>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
