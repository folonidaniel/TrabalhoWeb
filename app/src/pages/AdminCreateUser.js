import React, { useState } from "react";
import styles from "../styles/AdminCreateUser.module.css";
import { useNavigate, useLocation, Link } from "react-router";
import SearchBar from "../components/SearchBar";
import AdminNavbar from "../components/AdminNavbar";
import { isValidEmail, isValidPhone, readUsers, updateUsers } from "../Utils"
import Success from "../components/Success";
import Error from "../components/Error";

export default function AdminCreateUser() {
  const navigate = useNavigate() 
  // Estados para mensagens de erro e carregamento
  const [success, setSuccess] = useState(null);
  const [requestError, setRequestError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  function handleSearch(event) {
    if (event.key !== "Enter" && event.type !== "click") return
    navigate("/search-users-admin", { state: event.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pega todos os inputs do formulário
    const inputs = Array.from(document.getElementsByTagName("input"))
    const phoneElem = document.getElementsByTagName("input")[3]
    const emailElem = document.getElementsByTagName("input")[4]

    let hasInvalidInput = false
    let errorMsg = ""

    // Validação do email
    if (!isValidEmail(emailElem.value)) {
      hasInvalidInput = true
      errorMsg += "Email inválido"
    }

    // Validação do telefone
    if (!isValidPhone(phoneElem.value)) {
      if (hasInvalidInput) errorMsg += " e "
      errorMsg += "Telefone inválido"
      hasInvalidInput = true
    }

    // Se houver input inválido, exibe erro e remove estilo após 2s
    if (hasInvalidInput) {
      setValidationError(errorMsg)
      setTimeout(() => {
        setValidationError(null)
      }, 2000)
    } else {
      let newUser = {}
      inputs.forEach((input) => {
          if(input.type === "checkbox") newUser[input.name] = input.checked
          else {
            newUser[input.name] = input.value
            input.value = ""
          }
      })
      // Atualiza a lista de usuários
      let users = await readUsers()
      if(users === null) users = []
      newUser.id = users.length
      users.push(newUser)
      await updateUsers(users).catch(async () => {
        setIsLoaded(true)
        const error = {
          title: "Erro interno do servidor.",
          message: "Por favor, tente novamente."
        }
        setRequestError(error)
      })
      setSuccess("Usuário cadastrado com sucesso!")
      setTimeout(() => {
        setSuccess(null)
      }, 1500)
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* NAVBAR */}
      <AdminNavbar />
      <div className={styles.outerContainer}>
        <SearchBar placeholder="Buscar usuário..." initialValue="" width="352px" marginBottom="20px" onClick={handleSearch} onKeyDown={handleSearch} />
        {success !== null ? (
          <Success message={success} />
        ) : (
          <></>
        )}
        {validationError !== null ? (
          <Error className="sus" message={validationError} />
        ) : (
          <></>
        )}

        {/* FORM CARD */}
        <div className={styles.card}>
          <div className={styles.label}>
            Nome:
            <input
              required
              className={styles.input}
              type="text"
              name="name"
            />
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <label className={styles.fieldLabel} htmlFor="endereco">Endereço:</label>
              <input
                required
                className={styles.inputShort}
                type="text"
                name="address"
              />
            </div>
            <div className={styles.formRow}>
              <label className={styles.fieldLabel} htmlFor="telefone">Telefone:</label>
              <input
                required
                className={styles.inputShort}
                type="text"
                name="phone"
              />
            </div>
            <div className={styles.formRow}>
              <label className={styles.fieldLabel} htmlFor="email">Email:</label>
              <input
                required
                className={styles.inputShort}
                type="email"
                name="email"
              />
            </div>
            <div className={styles.formRow}>
              <label className={styles.fieldLabel} htmlFor="password">Password:</label>
              <input
                required
                className={styles.inputShort}
                type="password"
                name="password"
              />
            </div>
            <div className={styles.formRow}>
              <label className={styles.fieldLabel} htmlFor="admin" style={{ minWidth: 58 }}>Admin:</label>
              <input
                type="checkbox"
                className={styles.checkbox}
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
    </div>
  );

};
