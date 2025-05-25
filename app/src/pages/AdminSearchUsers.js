import React, { useState } from "react";
import styles from "../styles/Admin.search.users.css";

export function AdminSearchUsers (){
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <span className={styles.plus}>+</span>
              <div className={styles.dots}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </div>
            </div>
          </div>
          
          <nav className={styles.navigation}>
            <button className={styles.navButton}>
              Usuários
              <span className={styles.dropdownArrow}>▼</span>
            </button>
            <button className={styles.navButton}>
              Produtos
              <span className={styles.dropdownArrow}>▼</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Usuários</h1>
          
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input 
                type="text" 
                placeholder="Buscar..." 
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};