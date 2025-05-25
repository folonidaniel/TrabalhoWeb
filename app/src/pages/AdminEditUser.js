import React, { useState } from "react";
import styles from "../styles/Admin.edit.user.css";
import { useNavigate, useLocation, Link } from "react-router";

export function AdminEditUser() {
  return (
    <div className={styles.pageBg}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoCircle}>
            <span className={styles.logoPlusH}></span>
            <span className={styles.logoPlusV}></span>
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
            disabled
          />
        </div>
      </div>

      {/* MAIN CARD */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>João da Silva</div>
        <div className={styles.cardInfo}>
          <span className={styles.infoLabel}>Admin:</span>
          <span className={styles.adminSquare}></span>
          <br />
          <span className={styles.infoLabel}>Endereço:</span>{" "}
          Rua Cinco, Chácara Estrela D'Alva, Sumaré-SP
          <br />
          <span className={styles.infoLabel}>Telefone:</span> (67) 2284-3566
          <br />
          <span className={styles.infoLabel}>Email:</span> joaodasilva@gmail.com
        </div>
        <div className={styles.buttonRow}>
          <button className={styles.excluirBtn}>Excluir</button>
          <button className={styles.salvarBtn}>Salvar</button>
        </div>
      </div>
    </div>
  );
};