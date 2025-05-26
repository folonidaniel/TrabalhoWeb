import React, { useState } from "react";
import styles from "../styles/AdminCreateProduct.module.css";
import SearchBar from "../components/SearchBar";

export function AdminCreateProduct(){
  const [form, setForm] = useState({
    titulo: "",
    quantidade: "",
    descricao: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo only: Show form payload
    alert(JSON.stringify(form, null, 2));
  };

  return (
    <>
    <div className={styles.pageBg}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <span className={styles.logoDot}></span>
            <span className={styles.logoDot2}></span>
            <span className={styles.logoLine1}></span>
            <span className={styles.logoLine2}></span>
          </span>
        </div>
        <div className={styles.menu}>
          <button className={styles.menuItem}>Usuários ▾</button>
          <button className={styles.menuItem}>Produtos ▾</button>
        </div>
      </nav>

      <SearchBar initialValue="" width="352px" onClick={handleSearch} onKeyDown={handleSearch} />

      {/* FORM CARD */}
      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          {/* Left side: plus icon */}
          <div className={styles.cardLeft}>
            <div className={styles.plusBox}>
              <img id={styles["plus-icon"]} src="/icons/plus-solid.svg" alt="Imagem_jogo" />
            </div>
          </div>
          {/* Right side: inputs */}
          <div className={styles.cardRight}>
            <input
              className={styles.input}
              type="text"
              name="titulo"
              placeholder="Título..."
              value={form.titulo}
              onChange={handleChange}
              autoComplete="off"
            />
            <input
              className={styles.inputSmall}
              type="text"
              name="quantidade"
              placeholder="Quantidade..."
              value={form.quantidade}
              onChange={handleChange}
              autoComplete="off"
            />
            <textarea
              className={styles.textarea}
              name="descricao"
              placeholder="Descrição..."
              value={form.descricao}
              onChange={handleChange}
              autoComplete="off"
              rows={6}
            />
            <div className={styles.controlsRow}>
              <button type="button" className={styles.addBtn}>
                <img  src="/icons/plus-solid.svg" alt="Adicionar_Categoria" />
              </button>
              <button type="submit" className={styles.submitBtn}>
                Cadastrar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
    
  );
};
