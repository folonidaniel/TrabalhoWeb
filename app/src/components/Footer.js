import styles from '../styles/Footer.module.css'
import {Link} from "react-router"
import { useState } from "react";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_container}>
        <div className={styles.footer_section}>
          <h2 className={styles.footer_logo}>LojaDeGames 3000</h2>
          <p className={styles.footer_description}>
            Sua loja preferida de Games.
          </p>
        </div>

        <div className={styles.footer_section}>
          <h3>Links</h3>
          <ul className={styles.footer_links}>
            <li><a href="/">
                      Início
                </a>
              </li>
            <li><a href="/about-us">Sobre Nós</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Cadastro</a></li>
          </ul>
        </div>

        <div className={styles.footer_section}>
          <h3>Contato</h3>
          <p>loja_games@games3000.com</p>
          <p>+55 16 99793-4621</p>
        </div>

      </div>

      <div className={styles.footer_bottom}>
        © {new Date().getFullYear()} LojaDeGames 3000. Todos os direitos reservados.
      </div>
    </footer>
  );
}

export default Footer;