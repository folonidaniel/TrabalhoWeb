import React from "react";
import styles from "../styles/Admin.edit.product.css";
import { Search } from "lucide-react";

export function AdminEditProduct()  {
  return (
    <div className={styles.pageBg}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <span className={styles.logoDot}></span>
            <span className={styles.logoLine1}></span>
            <span className={styles.logoLine2}></span>
          </span>
        </div>
        <div className={styles.menu}>
          <button className={styles.menuItem}>Usuários ▾</button>
          <button className={styles.menuItem}>Produtos ▾</button>
        </div>
      </nav>

      {/* SEARCH BAR */}
      <div className={styles.searchBarContainer}>
        <div className={styles.searchBarWrapper}>
          <Search className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder=""
            aria-label="Pesquisar"
          />
        </div>
      </div>

      {/* PRODUCT CARD */}
      <div className={styles.card}>
        <div className={styles.cardLeft}>
          {/* Image placeholder */}
          <div className={styles.imagePlaceholder}></div>
        </div>
        <div className={styles.cardRight}>
          <input
            type="text"
            value="Título"
            className={styles.titleInput}
            readOnly
          />
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>Em estoque:</div>
            <input
              type="text"
              value="100"
              className={styles.infoInput}
              readOnly
            />
          </div>
          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>Vendido:</div>
            <input
              type="text"
              value="50"
              className={styles.infoInput}
              readOnly
            />
          </div>
          <textarea
            className={styles.descTextarea}
            value={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices id massa at vestibulum. Vivamus semper elementum leo, ut pharetra ligula fermentum eu. Nullam sit amet commodo elit. Aenean ac lorem consequat, dignissim nulla at, efficitur tellus. Phasellus bibendum dolor odio, bibendum rutrum velit rutrum vitae. Aulium bibendum rhoncus felis, et placerat exaelea non bibendum. Vivamus laoreet eros arcu, quisque dignissim ligula nisl, eu porta erat eleifend sit amet. Mauris laoreet facilisis tempor. Quisque sed tempor nulla. Nunc dignissim placerat bibendum. Nect malesuada iaculis augue sed aliquam. Nulla magna in dui eleifend bibendum. Sed tincidunt laoreet ex, maximus lacinia consectetur vitae. Donec feugiat a nisi in dapibus. Sed et tortor congue, maximus neque eu, iaculis nulla. Nul dignissim felis est, vel varius ligula dictum ut. Nulla dapibus eleifend justo eu bibendum."
            }
            readOnly
            rows={7}
          />
          <div className={styles.tagRow}>
            <span className={`${styles.tag} ${styles.acao}`}>Ação</span>
            <span className={`${styles.tag} ${styles.aventura}`}>Aventura</span>
          </div>
          <div className={styles.buttonRow}>
            <button className={styles.excluirBtn}>Excluir</button>
            <button className={styles.salvarBtn}>Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
};
