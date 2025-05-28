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
import styles from "../styles/AdminSearchProduct.module.css"
import AdminNavbar from "../components/AdminNavbar";

export default function SearchProducts() {
    // Hook para acessar informações passadas pela navegação 
    const location = useLocation();

    const [error, setError] = useState(null);// Armazena informações de erro, se houver
    const [isLoaded, setIsLoaded] = useState(false); // Indica se os dados foram carregados
    const [results, setResults] = useState([])// Armazena os resultados da busca
    const [initialValues, setInitialValues] = useState([])// Armazena todos os produtos disponíveis
    const [initialSearch, setInitialSearch] = useState(location.state)// Recebe o valor inicial de busca via navegação
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/mocks/main/all.json")// Faz requisição local para obter todos os produtos
            const products = await response.json() // Converte resposta em JSON
            setInitialValues(products) // Salva todos os produtos no estado
            setResults(products)// Inicialmente, exibe todos os produtos
            setIsLoaded(true);// Marca como carregado
            if (initialSearch !== null) {
                search(initialSearch, products)// Reseta o valor após a busca inicial
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
        array.forEach((item) => {
            if (item.title.toLowerCase().match(str.toLowerCase()))// Busca insensível a maiúsculas/minúsculas
                newResults.push(item)
        })
        setResults(newResults)// Atualiza resultados com o que foi encontrado
    }
    //Função para lidar com mudanças no campo de busca:
    const handleChange = (event) => search(event.target.value, initialValues);

    if (!isLoaded) {
        return (
            <>
                <AdminNavbar/>
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
            <AdminNavbar/>
            <main className={styles.main}>
                {/* Renderiza a barra de busca */}
                <SearchBar
                    placeholder="Buscar produtos..."
                    initialValue={location.state !== null ? location.state : ""}
                    width="80vmin"
                    onChange={handleChange} />

                <div className={styles.resultsContainer}>
                    {/* Itera sobre os resultados e renderiza cada produto */}
                    {results.map((item, i) => (
                        <div key={i} className={styles.productContainer}>
                            <a className={styles.imageContainer} href={"/edit-product/" + item.id}><img className={styles.img} src={item.images[0]} /></a>
                            <h3 className={styles.title}>{item.title}</h3>
                        </div>
                    ))}
                </div>
                {/*Exibe mensagem se nenhum resultado for encontrado: */}
                {results.length === 0 ? (
                    <h3>Nenhum resultado encontrado :</h3>
                ) : (
                    <></>
                )}
                <Footer />
            </main>
        </>
    )
}
