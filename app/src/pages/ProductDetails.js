import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/ProductDetails.module.css";

export function ProductDetails() {
    const params = useParams();

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [product, setProduct] = useState([]);
    useEffect(() => {
        fetch(`/mocks/productDetails/${params.id}.json`)
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setProduct(result);
                },

                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    const [quantity, setQuantity] = useState(1)
    const navigate = useNavigate()

    if (error) return <div>Product Not Found</div>
    else if (!isLoaded) return <div>Carregando</div>

    function handleCart() {
        const loggedUser = sessionStorage.getItem("loggedUser")

        let cart = JSON.parse(sessionStorage.getItem("cart"))
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
        sessionStorage.setItem("cart", JSON.stringify(cart))

        if (loggedUser == null) {
            navigate("/login", { state: "/cart" })
        } else {
            navigate("/cart")
        }
    }

    function handleBuyNow() {
        const loggedUser = sessionStorage.getItem("loggedUser")
        if (loggedUser == null) {
            navigate("/login")
            return;
        }

        let cart = JSON.parse(sessionStorage.getItem("cart"))
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
        sessionStorage.setItem("cart", JSON.stringify(cart))
        sessionStorage.setItem("cart", JSON.stringify(cart))
        navigate("/checkout")
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
