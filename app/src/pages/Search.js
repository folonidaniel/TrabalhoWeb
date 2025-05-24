import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import styles from "../styles/Search.module.css"

export function Search(){
    const location = useLocation();
    
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [results, setResults] = useState([])
    const [initialValues, setInitialValues] = useState([])
    const [initialSearch, setInitialSearch] = useState(location.state)
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/mocks/main/all.json")
            const products = await response.json()
            setInitialValues(products)
            setResults(products)
            setIsLoaded(true);
            if(initialSearch !== null){
                search(initialSearch, products)
                setInitialSearch(null)
            }
        }
        fetchData().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })
    }, [])

    if (error) return <div>Erro Interno</div>
    else if (!isLoaded) return <div>Carregando...</div>
        
    function search(str, array){
        const newResults = []
        array.forEach( (item) => {
            if(item.title.toLowerCase().match(str.toLowerCase()))
                newResults.push(item)
        })
        setResults(newResults)
    }
    const handleChange = (event) => search(event.target.value, initialValues);

    return (
        <main className={styles.main}>
            <Navbar/>
            <SearchBar 
                initialValue={location.state !== null ? location.state : ""} 
                width="80vmin"
                onChange={handleChange}/>

            <div className={styles.resultsContainer}>
                {results.map( (item, i) => (
                    <div key={i} className={styles.productContainer}>
                        <a className={styles.imageContainer} href={"/product/" + item.id}><img className={styles.img} src={item.images[0]}/></a>
                        <h3 className={styles.title}>{item.title}</h3>
                    </div>
                ))}
            </div>
            {results.length === 0 ? (
                <h3>Nenhum resultado encontrado :(</h3>
            ) : (
                <></>
            )}
        </main>
    )
}