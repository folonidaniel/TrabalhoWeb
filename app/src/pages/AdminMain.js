import React, { useState } from "react";
import styles from "../styles/AdminMain.module.css";
import AdminNavbar from "../components/AdminNavbar";

function handleSearch(){
  
}

export default function AdminMain() {
  return (
    <div className={styles.pageBg}>
      {/* NAVBAR */}
      <AdminNavbar/>

      {/* CENTERED GREETING */}
      <main className={styles.centered}>
        <h1 className={styles.greeting}>Olá, Admin!</h1>
      </main>
    </div>
  );
};