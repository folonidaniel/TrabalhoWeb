// Importação do CSS específico para o componente
import styles from "../styles/Main.module.css";

// Importação de componentes reutilizáveis
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import Loading from "../components/Loading";

// Importação de hooks do React
import { useEffect, useState } from "react"

// Importação de hook para navegação
import { useNavigate } from "react-router"

// Importação de utilitários personalizados
import { CheckForMobile, delay } from "../Utils"

export default function Main() {
  const navigate = useNavigate()// Hook para redirecionamento de páginas
  const [bannerIndex, setBannerIndex] = useState(0)// Índice do banner atual
  const [error, setError] = useState(null);// Estado de erro na requisição
  const [isLoaded, setIsLoaded] = useState(false);// Controle de carregamento
  const [categories, setCategories] = useState([])// Categorias de produtos
  const [products, setProducts] = useState({})//Objeto com produtos categorizados.
  const [counters, setCounters] = useState({})// controla a paginação de cada categoria
  const isOnMobile = CheckForMobile()//Detecta se o usuário está em um dispositivo móvel.

  //Lista as imagens do Banner
  const bannerImgs = [
    {
      id: 15,
      path: "/game-imgs/hollow-knight-banner.png"
    },
    {
      id: 1,
      path: "/game-imgs/celeste-banner.png"
    },
    {
      id: 5,
      path: "/game-imgs/ori-and-the-blind-forest-banner.jpg"
    }
  ]

  //A cada 5 segundos, muda a imagem do banner
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((i) => {
        if (i + 1 === bannerImgs.length) return 0
        else return i + 1
      })
    }, 5000)
    return () => clearInterval(interval)
  })

//Faz um fetch para obter os produtos em formato json
  useEffect( () => {
      const fetchData = async () => {
        const response = await fetch("/mocks/main/all.json")
        const products = await response.json()
        let initialCategories = []//Cria lista de categorias
        let initialProducts = {}//Organiza os produtos por categoria
        let initialCounters = {}//Inicia o contador de paginação para cada categoria em 0

        products.forEach((product) => {
          product.categories.forEach((category) => {
            if (!initialCategories.includes(category)) initialCategories.push(category)
            if (!(category in initialProducts)) initialProducts[category] = []
            if (!(category in initialCounters)) initialCounters[category] = 0
            initialProducts[category].push(product)
          })
        })
        setCategories(initialCategories)
        setProducts(initialProducts)
        setCounters(initialCounters)
        setIsLoaded(true);
      }
      fetchData().catch(async () => {
            setIsLoaded(true)//Sinaliza o fim do carregamento
            //Em caso de erro...
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })
  }, [])
//Executa a busca se o usuário apertar a tecla 'Enter' ou clicar.
//Também redireciona para a área de busca
  function handleSearch(event) {
    if (event.key !== "Enter" && event.type !== "click") return
    navigate("/search", { state: event.target.value })
  }

  //Decrementa contador da categoria, mostrando os produtos anteriores.
  function handlePrevious(event) {
    let newCounters = { ...counters }
    newCounters[event.target.getAttribute("category")]--
    setCounters(newCounters)
  }

  //Incrementa contador da categoria, mostrando os próximos produtos.
  function handleNext(event) {
    let newCounters = { ...counters }
    newCounters[event.target.getAttribute("category")]++
    setCounters(newCounters)
  }
  //Enquanto não carrega os dados, mostra Navbar,loading e footer
  if(!isLoaded){
    return (
      <>
        <Navbar/>
        <Loading/>
        <Footer/>
      </>
    )
  }

  
  return (
    <>
      <Navbar></Navbar>
      <div className={styles["center-containers"]}>
        <div id={styles["banner-container"]}>
          {/* Exibe imagem atual do banner */}
          <a className={styles.aBanner} href={"/product/" + bannerImgs[bannerIndex].id}>
            <img
              id={styles["banner"]}
              src={bannerImgs[bannerIndex].path}
              alt="Banner"
            />
          </a>
          <div className={styles.circlesContainer}>
             {/* Renderiza os indicadores circulares para mostrar qual banner está ativo */}
            {bannerImgs.map((item, i) => (
              <div key={i} className={styles.circlesContainer}>
                <img
                  style={{ left: bannerImgs.length <= 3 ? 45 + i * 5 + "%" : 45 - (bannerImgs.length) + i * 5 + "%" }}
                  className={styles["circles"]}
                  src={bannerIndex === i ? "/icons/selected-circle.svg" : "/icons/circle.svg"}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles["center-containers"]}>
        <SearchBar initialValue="" width="352px" onClick={handleSearch} onKeyDown={handleSearch} />
      </div>
      <div className={styles.outerContainer}>
        {/* Array de categorias. Map vai iterar sobre cada categoria */}
        {categories.map((category, i) => (
          <div key={i} className={styles.container}>
            {/* Para cada categoria, será criada uma div */}
            <h3 className={styles["category-titles"]}>{category}</h3>
            <div className={styles["category"]}>
              {/* Verifica se o usuário está num dispositivo mobile */}
              {!isOnMobile ? (
                <>
                  {counters[category] !== 0 && (
                    <img
                      className={styles["less"]}
                      src="/icons/less-than-solid.svg"
                      category={category}
                      onClick={handlePrevious}
                      alt="Voltar"
                    />
                  )}
                  {
                    products[category].slice(counters[category] * 4, (counters[category] + 1) * 4).map((product, j) => (
                      <div key={j} className={styles["container-cover-arts"]}>
                         {/* Products[category] pega todos os produtos dessa categoria*/}
                         {/*Slice vai pegar um subconjunto de produtos*/ }
                        <a href={`/product/${product.id}`}>
                          <img
                            className={styles["cover-art"]}
                            src={product.images[0]}
                            alt=""
                          />
                        </a>
                        <h4 className={styles["game-titles"]}>{product.title}</h4>
                      </div>
                    ))
                  }
                  {(counters[category] + 1) * 4 < products[category].length && (
                    <img
                      className={styles["greater"]}
                      src="/icons/greater-than-solid.svg"
                      category={category}
                      onClick={handleNext}
                      alt="Próximo"
                    />
                  )}
                </>
              ) : (
                <>
                  {products[category].map((product, j) => (
                    <div key={j} className={styles["container-cover-arts"]}>
                      {/*Cada produto é um div */}
                      <a href={`/product/${product.id}`}>
                        <img
                          className={styles["cover-art"]}
                          src={product.images[0]}
                          alt=""
                        />
                      </a>
                      <h4 className={styles["game-titles"]}>{product.title}</h4>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <Footer></Footer>
    </>
  );
}
