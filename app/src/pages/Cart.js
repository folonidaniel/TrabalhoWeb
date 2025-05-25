import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Loading from "../components/Loading"
import Error from "../components/Error"
import styles from "../styles/Cart.module.css"
import { delay, readCart, updateCart } from "../Utils"
import FullPageError from "../components/FullPageError"

export default function Cart() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [state, setState] = useState(null)
    
    useEffect( () => {
        const fetchData = async () => {
            let cart = await readCart()
            if (cart == null) cart = []
            setState(cart)
            setIsLoaded(true)
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

    async function handleQuantity(operation, productId) {
        let nextState = state.map((product) => {
            if (product.id == productId) {
                let newProduct = { ...product }
                if (operation === 0) newProduct.quantity = product.quantity - 1
                else newProduct.quantity = product.quantity + 1
                return newProduct
            } else return product
        })

        await updateCart(nextState).catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })
        nextState = nextState.filter(product => product.quantity != 0)
        setState(nextState)
    }
    
    if(!isLoaded){
        return (
            <>
                <Navbar/>
                <Loading/>
                <Footer/>
            </>
        )
    } else if(error !== null){
        return (
            <FullPageError title={error.title} message={error.message}/>
        )
    }

    if (state.length > 0)
        return (
            <div className={styles.container}>
                <Navbar></Navbar>

                <main className={styles.main}>
                    {state.map((product) => (
                        <div key={product.id} className={styles.cartItem}>
                            <img src={product.images[0]} className={styles.itemImage} />

                            <div className={styles.itemInfo}>
                                <div className={styles.itemTitle}>{product.title}</div>

                                <div className={styles.quantityControl}>
                                   {product.quantity != 1 ? (
                                        <button
                                            className={styles.quantityButton}
                                            onClick={() => handleQuantity(0, product.id)}>
                                            -
                                        </button>
                                    ) : (
                                       <img data-testid="remove" className={styles.trash} src="/icons/trash-solid.svg" onClick={() => handleQuantity(0, product.id)}></img>
                                    )}
                                    <span data-testid="quantity" className={styles.quantityDisplay}>{product.quantity}</span>
                        
                                   {product.quantity != product.quantityInStock ? (
                                        <button
                                            className={styles.quantityButton}
                                            onClick={() => handleQuantity(1, product.id)} >
                                            +
                                        </button>
                                    ) : (
                                        <button 
                                            style={{width: "35px", height: "35px", background: "none", border: "none"}}>
                                        </button>
                                    )}

                                </div>
                                <span className={styles.stock}>Quantidade em estoque: {product.quantityInStock}</span>
                            </div>

                            <div className={styles.itemPrice}> {(product.price * product.quantity).toFixed(2)} R$ </div>
                        </div>
                    ))}
                </main>

                <hr className={styles.divisionLine} />
                <div className={styles.totalContainer}>
                    <span data-testid="totalPrice" className={styles.total}>
                        Total: {state.reduce((acc, product) => acc += product.quantity * product.price, 0).toFixed(2)} R$
                    </span>
                    <a href="/checkout">
                        <button className={styles.continueButton}>
                            Continuar
                        </button>
                    </a>
                </div>
                <Footer></Footer>
            </div>
        );
    else
        return (
            <div>
                <Navbar></Navbar>
                <div className={styles.emptyCartContainer}>
                    <h1 className={styles.h1}>O carrinho está vazio</h1>
                    <span className={styles.emptyCart}>Adicione jogos <a href="/" className={styles.a}>aqui</a></span>
                </div>
                <Footer></Footer>
            </div>
        )
}