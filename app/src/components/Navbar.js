import styles from '../styles/Navbar.module.css'

export default function Navbar() {
  return (
    <>
      <nav id={styles["navbar"]}>
        <img
          id={styles["logo-icon"]}
          src="icons/gamepad-solid.svg"
          alt="Logo"
        />
        <a href="#" className={styles["nav-right-items"]}>
          Sobre Nós
        </a>
        <a href="#" className={styles["nav-right-items"]}>
          Minha Conta
        </a>
        <img
          id={styles["cart-icon"]}
          className={styles["nav-right-items"]}
          src="icons/cart-shopping-solid.svg"
          alt="Carrinho"
        />
        <img id={styles["menu-icon"]} src="icons/bars-solid.svg" alt="Menu" />
      </nav>
    </>
  );
}
