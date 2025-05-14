import { useState } from "react"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import styles from "../styles/Cart.module.css"


export function Cart() {
    let cart = JSON.parse(sessionStorage.getItem("cart"))
    if (cart == null) cart = []
    const [state, setState] = useState(cart)

    function handleQuantity(operation, productId) {
        let nextState = state.map((product) => {
            if (product.id == productId) {
                let newProduct = { ...product }
                if (operation === 0) newProduct.quantity = product.quantity - 1
                else newProduct.quantity = product.quantity + 1
                return newProduct
            } else return product
        })

        nextState = nextState.filter(product => product.quantity != 0)
        setState(nextState)

        sessionStorage.setItem("cart", JSON.stringify(nextState))
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
                                       <img className={styles.trash} src="/icons/trash-solid.svg" onClick={() => handleQuantity(0, product.id)}></img>
                                    )}
                                    <span className={styles.quantityDisplay}>{product.quantity}</span>
                        
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
                    <span className={styles.total}>
                        Total: {state.reduce((acc, product) => acc += product.quantity * product.price, 0).toFixed(2)} R$
                    </span>
                    <button className={styles.continueButton}>
                        Continuar
                    </button>
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
                    <span className={styles.emptyCart}>Adicione jogos <a href="/">aqui</a></span>
                </div>
                <Footer></Footer>
            </div>
        )
}