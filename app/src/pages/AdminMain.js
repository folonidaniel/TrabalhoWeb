import React, { useState } from "react";
import styles from "../styles/Admin.main.css";

export function AdminMain() {
  return (
    <div className={styles.pageBg}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoCircle}>
            <span className={styles.logoPlusH}></span>
            <span className={styles.logoPlusV}></span>
            <span className={styles.logoDot}></span>
          </span>
        </div>
        <div className={styles.menu}>
          <button className={styles.menuItem}>Usuários <span className={styles.menuArrow}>▼</span></button>
          <button className={styles.menuItem}>Produtos <span className={styles.menuArrow}>▼</span></button>
        </div>
      </nav>

      {/* CENTERED GREETING */}
      <main className={styles.centered}>
        <h1 className={styles.greeting}>Olá, Admin!</h1>
      </main>
    </div>
  );
};