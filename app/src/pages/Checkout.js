import styles from "../styles/Checkout.module.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import SuccessPopup from "../components/SuccessPopup"
import { delay, readCart, readLoggedUser, updateCart, updateStock } from "../Utils"
import Loading from "../components/Loading"

export function Checkout() {
    const [cart, setCart] = useState(null)
    const [loggedUser, setLoggedUser] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null)
    const [step, setStep] = useState("address")
    const [success, setSuccess] = useState(false)
    const [cardInfo, setCardInfo] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            let fetchedCart = await readCart()
            if (fetchedCart == null) fetchedCart = []
            if (fetchedCart.length === 0) {
                navigate("/")
                return
            }
            setCart(fetchedCart)

            let fetchedUser = await readLoggedUser()
            if (fetchedUser === null) {
                navigate("/login")
                return
            }
            setLoggedUser(fetchedUser)
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

    function validateCardNumber(cardNumber) {
        const regex = /^\d{4} \d{4} \d{4} \d{4}/
        return regex.test(cardNumber)
    }

    function validateExpDate(expDate) {
        const regex = /^\d{2}\/\d{4}/
        return regex.test(expDate)
    }

    function validateCVV(cvv) {
        const regex = /^\d{3}$/
        return regex.test(cvv)
    }

    function handlePaymentSection(event) {
        const inputs = document.getElementsByTagName("input")
        const nameElem = inputs[0]
        const numberElem = inputs[1]
        const expDateElem = inputs[2]
        const cvvElem = inputs[3]
        const action = event.target.getAttribute("next")

        let hasInvalidInput = false
        if (nameElem.value.length <= 2) {
            nameElem.className = styles.invalidInput
            hasInvalidInput = true
        }
        if (!validateCardNumber(numberElem.value)) {
            numberElem.className = styles.invalidInput
            hasInvalidInput = true
        }
        if (!validateExpDate(expDateElem.value)) {
            expDateElem.className = styles.invalidInput
            hasInvalidInput = true
        }
        if (!validateCVV(cvvElem.value)) {
            cvvElem.className = styles.invalidInput
            hasInvalidInput = true
        }
        if (hasInvalidInput && action !== "back") {
            setTimeout(() => {
                nameElem.className = styles.input
                numberElem.className = styles.input
                expDateElem.className = styles.input
                cvvElem.className = styles.input
            }, 2000)
            return;
        }

        let newCardInfo = {}
        Array.from(inputs).forEach((input) => {
            newCardInfo[input.name] = input.value
        })
        setCardInfo(newCardInfo)
        if (action === "back") setStep("address")
        else setStep("review")
    }

    async function handleSuccess() {
        cart.forEach( async (product) => {
            await updateStock(product, product.quantityInStock - product.quantity).catch(async () => {
                setIsLoaded(true)
                const error = {
                    title: "Erro interno do servidor.",
                    message: "Por favor, tente novamente."
                }
                setError(error)
            })
        })

        await updateCart([]).catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        if (error !== null) return;

        setSuccess(true)

        await delay(2500)
        navigate("/")
    }

    if (!isLoaded) {
        return (
            <Loading />
        )
    }

    if (!success) {
        return (
            <>
                <div className={styles.checkoutContainer}>
                    <div className={styles.header}>
                        <h1>Checkout</h1>
                    </div>

                    <div className={styles.checkoutContent}>
                        <div className={styles.checkoutForm}>
                            {step === "address" && (
                                <div className={styles.addressSection}>
                                    <h2 className={styles.h2}>Endereço de Entrega</h2>
                                    <span className={styles.address}>{loggedUser.address}</span>
                                    <div className={styles.buttonContainer}>
                                        <a href="/cart">
                                            <button className={styles.secondaryButton}>
                                                Voltar ao Carrinho
                                            </button>
                                        </a>
                                        <button className={styles.primaryButton} onClick={() => setStep("payment")}>
                                            Pagamento
                                        </button>
                                    </div>
                                </div>
                            )}
                            {step === "payment" && (
                                <div className={styles.paymentSection}>
                                    <h2 className={styles.h2}>Informações de Pagamento</h2>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="name">Nome no Cartão</label>
                                        <input
                                            type="text"
                                            defaultValue={cardInfo !== null ? cardInfo.name : ""}
                                            className={styles.input}
                                            name="name"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="number">Número do Cartão</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            defaultValue={cardInfo !== null ? cardInfo.number : ""}
                                            name="number"
                                            placeholder="XXXX XXXX XXXX XXXX"
                                        />
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label} htmlFor="expDate">Data de Expiração</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                defaultValue={cardInfo !== null ? cardInfo.expDate : ""}
                                                name="expDate"
                                                placeholder="MM/AAAA"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label} htmlFor="cvv">CVV</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                defaultValue={cardInfo !== null ? cardInfo.cvv : ""}
                                                name="cvv"
                                                placeholder="XXX"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.buttonContainer}>
                                        <button next="back" className={styles.secondaryButton} onClick={handlePaymentSection}>
                                            Endereço
                                        </button>
                                        <button next="forward" className={styles.primaryButton} onClick={handlePaymentSection}>
                                            Revisar Compra
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === "review" && (
                                <div className={styles.reviewSection}>
                                    <h2 className={styles.h2}>Revisar Compra</h2>

                                    <div className={styles.reviewBlock}>
                                        <h3 className={styles.h3}>Endereço de Entrega</h3>
                                        <div className={styles.reviewInfo}>
                                            <span>{loggedUser.address}</span>
                                        </div>
                                    </div>

                                    <div className={styles.reviewBlock}>
                                        <h3 className={styles.h3}>Meio de Pagamento</h3>
                                        <div className={styles.reviewInfo}>
                                            <p>{cardInfo.name}</p>
                                            <p>Cartão com final: {cardInfo.number.slice(-4)}</p>
                                            <p>Data de expiração: {cardInfo.expDate}</p>
                                        </div>
                                    </div>

                                    <div className={styles.buttonContainer}>
                                        <button className={styles.secondaryButton} onClick={() => setStep("payment")}>
                                            Voltar
                                        </button>
                                        <button className={styles.primaryButton} onClick={handleSuccess}>
                                            Confimar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.orderSummary}>
                            <h2 className={styles.h2}>Resumo da Compra</h2>

                            <div className={styles.cartItems}>
                                {cart.map(item => (
                                    <div key={item.id} className={styles.cartItem}>
                                        <img src={item.images[0]} alt={item.title} />
                                        <div className={styles.itemDetails}>
                                            <h4>{item.title}</h4>
                                            <p className={styles.itemQuantity}>Qnt: {item.quantity}</p>
                                            <p className={styles.itemPrice}>R${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summaryDetails}>
                                <span>Total: R$ {cart.reduce((acc, product) => acc += product.quantity * product.price, 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <div className={styles.successPopupContainer}>
                <SuccessPopup color="blue" title="Compra concluída com sucesso!" msg="Seu produto irá chegar em breve." />
            </div>
        )
    }
}