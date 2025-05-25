import React, { useState } from "react";
import styles from "../styles/Admin.create.user.css";
import { useNavigate, useLocation, Link } from "react-router";

export function AdminCreateUser () {
  const [form, setForm] = useState({
    name: "",
    admin: false,
    endereco: "",
    telefone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo only: Just alert the data
    alert(JSON.stringify(form, null, 2));
  };

  return (<>
  <div className={styles.wrapper}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon} style={{ position: "relative" }}>
            <span className={styles.logoDot}></span>
            <span className={styles.logoDot2}></span>
            <span className={styles.logoLine1} style={{ background: "#01277d" }}></span>
            <span className={styles.logoLine2} style={{ background: "#01277d" }}></span>
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

      {/* FORM CARD */}
      <div className={styles.card}>
        <div className={styles.label}>
          Nome: 
          <input
            className={styles.input}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label className={styles.fieldLabel} htmlFor="admin" style={{ minWidth: 58 }}>Admin:</label>
            <input
              type="checkbox"
              id="admin"
              name="admin"
              checked={form.admin}
              onChange={handleChange}
              className={styles.checkbox}
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.fieldLabel} htmlFor="endereco">Endereço:</label>
            <input
              className={styles.inputShort}
              type="text"
              name="endereco"
              id="endereco"
              value={form.endereco}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.fieldLabel} htmlFor="telefone">Telefone:</label>
            <input
              className={styles.inputShort}
              type="text"
              name="telefone"
              id="telefone"
              value={form.telefone}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.fieldLabel} htmlFor="email">Email:</label>
            <input
              className={styles.inputShort}
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className={styles.buttonRow}>
            <button className={styles.submitBtn} type="submit">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  </>
  );
    
};
