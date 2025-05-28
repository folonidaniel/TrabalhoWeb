import React, { useEffect, useState } from "react";
import styles from "../styles/AdminEditUser.module.css";
import { useParams, useNavigate, useLocation, Link } from "react-router";
import SearchBar from "../components/SearchBar";
import AdminNavbar from "../components/AdminNavbar"
import { deleteLoggedUser, readUsers, updateLoggedUser, updateUsers } from "../Utils";
import Loading from "../components/Loading";
import FullPageError from "../components/FullPageError";
import Success from "../components/Success";
import SuccessPopup from "../components/SuccessPopup"

export default function AdminEditUser() {
    const params = useParams();// Hook para acessar parâmetros da rota (id do usuário)

    // Estados do componente
    const [user, setUser] = useState([]);// Armazena dados do usuário
    const [users, setUsers] = useState([]);// Armazena dados do usuário
    const [error, setError] = useState(null);// Armazena erro, se houver
    const [success, setSuccess] = useState(false)
    const [exclusionSuccess, setExclusionSuccess] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false);// Indica se os dados foram carregados
    const navigate = useNavigate()// Hook para navegação programática

    useEffect(() => {
        const fetchData = async () => {
            // Busca detalhes do usuário baseado no id da URL
            const response = await readUsers()
            setUsers(response)
            let fetchedUser = response.filter( (user) => user.id === Number(params.id))
            if(fetchedUser.length === 0) navigate("/main-admin")
          
            fetchedUser = fetchedUser[0]
            setIsLoaded(true);
            setUser(fetchedUser);
        }
        // Tratamento de erro na busca de dados
        fetchData().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })
    }, [])

    
function handleSearch(event) {
  if (event.key !== "Enter" && event.type !== "click") return
  navigate("/search-users-admin", { state: event.target.value })
}
  
async function handleExclusion(){
    const newUsers = users.filter((current) => current.id !== user.id)
    await updateUsers(newUsers)
    await deleteLoggedUser()

    setExclusionSuccess(true)
    setTimeout( () => {
        navigate("/search-users-admin")
    }, 1250)
}

async function handleSave(){
    const isAdmin = document.getElementsByTagName("input")[1].checked
    const newUsers = users.map((current) => {
      let newUser = {...current}
      if(current.id === user.id) newUser.isAdmin = isAdmin
      return newUser;
    })
    await updateUsers(newUsers) 
    setSuccess(true)
    setTimeout( () => {
      setSuccess(false)
      navigate("/search-users-admin")
    }, 1250)
}


    if (!isLoaded){
        return (
            <Loading/>
        )
    // Se houve erro, exibe componente de erro de página inteira
    } else if(error){
        return (
            <FullPageError title={error.title} message={error.message}/>
        )
    } else if(exclusionSuccess) {
      return (
        <div className={styles.exclusionSuccessContainer}>
          <SuccessPopup color="blue" title="Usuário excluído com sucesso!"/> 
        </div>
      )
    } else if(success){
      return (
        <div className={styles.exclusionSuccessContainer}>
          <SuccessPopup color="blue" title="Usuário atualizado com sucesso!"/> 
        </div>
      )
    }
    

  return (
      <>
    <AdminNavbar/>
    <div className={styles.pageBg}>
      <SearchBar placeholder="Buscar usuários..." initialValue="" width="352px" onClick={handleSearch} onKeyDown={handleSearch} />
      {/* MAIN CARD */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>{user.name}</div>
        <div className={styles.cardInfo}>
          <span className={styles.infoLabel}>Endereço:</span>{" "}
          {user.address}
          <br />
          <span className={styles.infoLabel}>Telefone:</span> (67) {user.phone}
          <br />
          <span className={styles.infoLabel}>Email:</span> {user.email}
          <br />
          <span id="isAdmin" className={styles.infoLabel}>Admin: </span>
          {user.isAdmin ? (
            <input className={styles.checkbox} type="checkbox" defaultChecked/>
          ) : (
            <input className={styles.checkbox} type="checkbox"/>
          )}
        </div>
        <div className={styles.buttonRow}>
          <button onClick={handleExclusion} className={styles.excluirBtn}>Excluir</button>
          <button onClick={handleSave} className={styles.salvarBtn}>Salvar</button>
        </div>
      </div>
    </div>
      </>
  );
};