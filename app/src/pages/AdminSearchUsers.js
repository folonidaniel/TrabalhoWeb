// Importa hooks do React
import { useState, useEffect } from "react";
// Importa hook de localização da rota
import { useLocation } from "react-router";
// Importa componentes de navegação e busca
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import FullPageError from "../components/FullPageError"
// Importa os estilos específicos deste componente
import styles from "../styles/AdminSearchUsers.module.css"
import AdminNavbar from "../components/AdminNavbar";
import { readUsers } from "../Utils";

export default function AdminSearchUsers() {
  // Hook para acessar informações passadas pela navegação 
  const location = useLocation();

  const [error, setError] = useState(null);// Armazena informações de erro, se houver
  const [isLoaded, setIsLoaded] = useState(false); // Indica se os dados foram carregados
  const [results, setResults] = useState([])// Armazena os resultados da busca
  const [initialValues, setInitialValues] = useState([])// Armazena todos os produtos disponíveis
  const [initialSearch, setInitialSearch] = useState(location.state)// Recebe o valor inicial de busca via navegação
  useEffect(() => {
    const fetchData = async () => {
      const users = await readUsers()// Faz requisição local para obter todos os produtos
      setInitialValues(users) // Salva todos os produtos no estado
      setResults(users)// Inicialmente, exibe todos os produtos
      setIsLoaded(true);// Marca como carregado
      if (initialSearch !== null) {
        search(initialSearch, users)// Reseta o valor após a busca inicial
        setInitialSearch(null)
      }
    }
    fetchData().catch(async () => {
      setIsLoaded(true)
      const error = {
        title: "Erro interno do servidor.",
        message: "Por favor, tente novamente."
      }
      setError(error)// Salva informações do erro
    })
  }, [])// Executa apenas uma vez na montagem

  function search(str, array) {
    const newResults = []
    array.forEach((user) => {
      if (user.name.toLowerCase().match(str.toLowerCase()))// Busca insensível a maiúsculas/minúsculas
        newResults.push(user)
    })
    setResults(newResults)// Atualiza resultados com o que foi encontrado
  }
  //Função para lidar com mudanças no campo de busca:
  const handleChange = (event) => search(event.target.value, initialValues);

  if (!isLoaded) {
    return (
      <>
        <AdminNavbar />
        <Loading />
        <Footer />
      </>
    )
  } else if (error !== null) {
    return (
      <FullPageError title={error.title} message={error.message} />
    )
  }

  return (
    <>
      <AdminNavbar />
      <main className={styles.main}>
        {/* Renderiza a barra de busca */}
        <SearchBar
          placeholder="Buscar usuários..."
          initialValue={location.state !== null ? location.state : ""}
          width="80vmin"
          onChange={handleChange} />

        <div className={styles.resultsContainer}>
          {/* Itera sobre os resultados e renderiza cada produto */}
          {results.map((user, i) => (
            <a href={`/edit-user/${user.id}`} className={styles.links}>
              <div className={styles.container}>
                <h2 className={styles.name}>{user.name}</h2>
                {user.isAdmin ? (
                  <span className={styles.admin}>ADMIN</span>
                ) : (
                  <span>Usuário</span>
                )}
              </div>
            </a>
          ))}
        </div>
        {/*Exibe mensagem se nenhum resultado for encontrado: */}
        {results.length === 0 ? (
          <h3>Nenhum resultado encontrado :(</h3>
        ) : (
          <></>
        )}
      </main>
      <Footer />
    </>
  )
}

