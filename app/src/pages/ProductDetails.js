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
    
    if(error) return <div>Product Not Found</div>
    else if(!isLoaded) return <div>Loading...</div>
        
    function handleCart(){
        const isLoggedIn = sessionStorage.getItem("isLoggedIn")
        if(isLoggedIn == null || !isLoggedIn){
            navigate("/login")
            return;
        }
        
        let cart = JSON.parse(sessionStorage.getItem("cart"))
        if(cart == null) cart = []
        
        let updatedProductQuantity = false
        cart = cart.map( (product) => {
            if(product.id == params.id){
                updatedProductQuantity = true
                let newProduct = {...product}
                newProduct.quantity += product.quantity
                return newProduct
            }
            return product
        })
        if(!updatedProductQuantity){
            let newProduct = {...product}
            newProduct.quantity = quantity
            cart.push(newProduct)
        }
        sessionStorage.setItem("cart", JSON.stringify(cart))
        navigate("/cart")
    }
    
    function handleBuyNow(){
        const isLoggedIn = sessionStorage.getItem("isLoggedIn")
        if(isLoggedIn == null || !isLoggedIn){
            navigate("/login")
            return;
        }
        
        let cart = JSON.parse(sessionStorage.getItem("cart"))
        if(cart == null) cart = []
        
        let updatedProductQuantity = false
        cart = cart.map( (product) => {
            if(product.id == params.id){
                updatedProductQuantity = true
                product.quantity += quantity
                return product 
            }
        })
        if(!updatedProductQuantity){
            cart.push({ 
            id: product.id, 
            quantity: product.quantity + quantity,
            title: product.title,
            images: product.images,
            categories: product.categories,
            price: product.price
            })
        }
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
                            {product.categories.map( (category) => (
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
                                <button
                                    className={styles.quantityControl}
                                    onClick={() => setQuantity(quantity + 1)}
                                >+</button>
                            </div>
                            <div className={styles.buttonGroup}>
                                <button className={styles.buyNowBtn} onClick={handleBuyNow}>Comprar Agora</button>
                                <button className={styles.addToCartBtn} onClick={handleCart}> Adicionar ao Carrinho </button>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer></Footer>
            </div>
        </>
    );
}
