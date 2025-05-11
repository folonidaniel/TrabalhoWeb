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
                                    <button
                                        className={styles.quantityButton}
                                        onClick={() => handleQuantity(0, product.id)}>
                                        -
                                    </button>
                                    <span className={styles.quantityDisplay}>{product.quantity}</span>
                                    <button
                                        className={styles.quantityButton}
                                        onClick={() => handleQuantity(1, product.id)} >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className={styles.itemPrice}> {(product.price * product.quantity).toFixed(2)} R$ </div>
                        </div>
                    ))}
                </main>

                <hr className={styles.divisionLine}/>
                <div className={styles.totalContainer}>
                    <span className={styles.total}>
                        Total: {state.reduce( (acc, product) => acc += product.quantity * product.price, 0).toFixed(2)} R$
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
                <h1>Vazio :(</h1>
                <Footer></Footer>
            </div>
        )
}