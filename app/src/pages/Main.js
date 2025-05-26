import styles from "../styles/Main.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import Loading from "../components/Loading";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { CheckForMobile, delay } from "../Utils"

export default function Main() {
  const navigate = useNavigate()
  const [bannerIndex, setBannerIndex] = useState(0)
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState({})
  const [counters, setCounters] = useState({})
  const isOnMobile = CheckForMobile()

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

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((i) => {
        if (i + 1 === bannerImgs.length) return 0
        else return i + 1
      })
    }, 5000)
    return () => clearInterval(interval)
  })

  useEffect( () => {
      const fetchData = async () => {
        const response = await fetch("/mocks/main/all.json")
        const products = await response.json()
        let initialCategories = []
        let initialProducts = {}
        let initialCounters = {}

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
    navigate("/search", { state: event.target.value })
  }

  function handlePrevious(event) {
    let newCounters = { ...counters }
    newCounters[event.target.getAttribute("category")]--
    setCounters(newCounters)
  }

  function handleNext(event) {
    let newCounters = { ...counters }
    newCounters[event.target.getAttribute("category")]++
    setCounters(newCounters)
  }
  
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
          <a className={styles.aBanner} href={"/product/" + bannerImgs[bannerIndex].id}>
            <img
              id={styles["banner"]}
              src={bannerImgs[bannerIndex].path}
              alt="Banner"
            />
          </a>
          <div className={styles.circlesContainer}>
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
        {categories.map((category, i) => (
          <div key={i} className={styles.container}>
            <h3 className={styles["category-titles"]}>{category}</h3>
            <div className={styles["category"]}>
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
