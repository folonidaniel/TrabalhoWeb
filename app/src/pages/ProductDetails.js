import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/ProductDetails.module.css";
import { readLoggedUser, readCart, updateCart } from "../Utils"
import Loading from "../components/Loading";
import FullPageError from "../components/FullPageError";

export default function ProductDetails() {
    const params = useParams();

    const [product, setProduct] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [quantity, setQuantity] = useState(1)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/mocks/productDetails/${params.id}.json`)
            const fetchedProduct = await response.json()
            setIsLoaded(true);
            setProduct(fetchedProduct);
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

    async function handleCart() {
        const loggedUser = await readLoggedUser().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        let cart = await readCart().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        if (cart == null) cart = []

        let updatedProductQuantity = false
        cart = cart.map((item) => {
            if (item.id == params.id) {
                updatedProductQuantity = true
                let newProduct = { ...item }
                newProduct.quantity += quantity
                return newProduct
            }
            return item
        })
        if (!updatedProductQuantity) {
            let newProduct = { ...product }
            newProduct.quantity = quantity
            cart.push(newProduct)
        }
        await updateCart(cart).catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })


        if (loggedUser == null) {
            navigate("/login", { state: "/cart" })
        } else {
            navigate("/cart")
        }
    }

    async function handleBuyNow() {
        const loggedUser = await readLoggedUser().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        if (loggedUser == null) {
            navigate("/login")
            return;
        }

        let cart = await readCart().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        if (cart == null) cart = []

        let updatedProductQuantity = false
        cart = cart.map((item) => {
            if (item.id == params.id) {
                updatedProductQuantity = true
                let newProduct = { ...item }
                newProduct.quantity += quantity
                return newProduct
            }
            return item
        })
        if (!updatedProductQuantity) {
            let newProduct = { ...product }
            newProduct.quantity = quantity
            cart.push(newProduct)
        }
        await updateCart(cart).catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        navigate("/checkout")
    }

    if (!isLoaded){
        return (
            <Loading/>
        )
    } else if(error){
        return (
            <FullPageError title={error.title} message={error.message}/>
        )
    }
        
    
    return (
        <>
            <Navbar></Navbar>
            <div className={styles.container}>
                <main className={styles.mainContent}>
                    <div className={styles.productImages}>
                        <img className={styles.mainImage} src={product.images[0]}></img>
                        <div className={styles.thumbnails}>
                            <img className={styles.thumbnail}></img>
                            <img className={styles.thumbnail}></img>
                            <img className={styles.thumbnail}></img>
                            <img className={styles.thumbnail}></img>
                            <img className={styles.thumbnail}></img>
                        </div>
                        <div className={styles.categories}>
                            {product.categories.map((category) => (
                                <div key={category} className={styles.category}>{category}</div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.productDetails}>
                        <h1 className={styles.productTitle}>{product.title}</h1>
                        <p className={styles.productDescription}>{product.description}</p>

                        <div className={styles.pricingSection}>
                            <span className={styles.price}>{product.price} R$</span>
                            <div className={styles.quantityContainer}>
                                <button
                                    className={styles.quantityControl}
                                    onClick={() => quantity > 1 ? setQuantity(quantity - 1) : 0}
                                >-</button>
                                <span className={styles.quantity}>Quantidade: {quantity}</span>
                                {quantity != product.quantityInStock ? (
                                    <button
                                        className={styles.quantityControl}
                                        onClick={() => setQuantity(quantity + 1)} >
                                        +
                                    </button>
                                ) : (
                                    <button
                                        className={styles.quantityControl}
                                        style={{minWidth: "15px", minHeight: "5px"}}>
                                    </button>
                                )}
                            </div>
                            <div className={styles.buttonGroup}>
                                <button className={styles.buyNowBtn} onClick={handleBuyNow}>Comprar Agora</button>
                                <button className={styles.addToCartBtn} onClick={handleCart}> Adicionar ao Carrinho </button>
                            </div>
                            <span style={{ marginTop: "10px", color: "rgba(255, 255, 255, 0.6)" }}>Quantidade em estoque: {product.quantityInStock}</span>
                        </div>
                    </div>
                </main>

                <Footer></Footer>
            </div>
        </>
    );
}
