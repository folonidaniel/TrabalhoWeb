// Importação de estilos, hooks e componentes auxiliares
import styles from "../styles/Checkout.module.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import SuccessPopup from "../components/SuccessPopup"
import { delay, readCart, readLoggedUser, updateCart, updateStock } from "../Utils"
import Loading from "../components/Loading"

// Define o componente funcional Checkout
export function Checkout() {
    //Define diversos estados para gerenciar:
    const [cart, setCart] = useState(null)//o carrinho
    const [loggedUser, setLoggedUser] = useState(null)//usuário logado
    const [isLoaded, setIsLoaded] = useState(false);//estado de carregamento
    const [error, setError] = useState(null)//erros
    const [step, setStep] = useState("address")//etapa atual do checkout
    const [success, setSuccess] = useState(false)//sucesso da operação
    const [cardInfo, setCardInfo] = useState(null)//informações do cartão de crédito
    const navigate = useNavigate()//Permite navegar entre rotas programaticamente.

    //Hook useEffect que executa ao montar o componente: busca dados do carrinho.
    useEffect(() => {
        const fetchData = async () => {
            let fetchedCart = await readCart()
            //Se o carrinho for nulo ou vazio, redireciona para a home.
            if (fetchedCart == null) fetchedCart = []
            if (fetchedCart.length === 0) {
                navigate("/")
                return
            }
            //Define os estados cart e loggedUser. Se o usuário não estiver logado, redireciona para /login
            setCart(fetchedCart)

            let fetchedUser = await readLoggedUser()
            if (fetchedUser === null) {
                navigate("/login")
                return
            }
            setLoggedUser(fetchedUser)
            setIsLoaded(true)
        }
        //Trata erro ao buscar dados, exibindo mensagem de erro apropriada.
        fetchData().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })
    }, [])

    //Valida formato de número de cartão (XXXX XXXX XXXX XXXX).
    function validateCardNumber(cardNumber) {
        const regex = /^\d{4} \d{4} \d{4} \d{4}/
        return regex.test(cardNumber)
    }
    //Valida formato da data de expiração (MM/AAAA).
    function validateExpDate(expDate) {
        const regex = /^\d{2}\/\d{4}/
        return regex.test(expDate)
    }
    //Valida formato do CVV (3 dígitos).
    function validateCVV(cvv) {
        const regex = /^\d{3}$/
        return regex.test(cvv)
    }

    // Obtém inputs diretamente do DOM
    function handlePaymentSection(event) {
        const inputs = document.getElementsByTagName("input")
        const nameElem = inputs[0]
        const numberElem = inputs[1]
        const expDateElem = inputs[2]
        const cvvElem = inputs[3]
        //Obtém o atributo next do botão clicado para determinar a navegação ("back" ou "forward").
        const action = event.target.getAttribute("next")

        //Flag para rastrear inputs inválidos.
        let hasInvalidInput = false
        //Valida todos os inputs e aplica classe de erro (styles.invalidInput) se forem inválidos. Se houver erro, limpa as classes após 2 segundos e interrompe a função.
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
        //Atualiza cardInfo com os dados inseridos.
        let newCardInfo = {}
        Array.from(inputs).forEach((input) => {
            newCardInfo[input.name] = input.value
        })
        setCardInfo(newCardInfo)
        //Navega entre as etapas de pagamento e revisão.
        if (action === "back") setStep("address")
        else setStep("review")
    }

    //Atualiza o estoque de cada produto do carrinho.
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
        //Limpa o carrinho após a compra.
        await updateCart([]).catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        if (error !== null) return;

        //Mostra SuccessPopup e, após delay, redireciona para home.
        setSuccess(true)

        await delay(2500)
        navigate("/")
    }
    //Enquanto dados são carregados, exibe componente de Loading
    if (!isLoaded) {
        return (
            <Loading />
        )
    }
    //Caso a compra ainda não tenha sido concluída, renderiza as diferentes etapas do checkout.
    if (!success) {
        return (
            <>
                <div className={styles.checkoutContainer}>
                    <div className={styles.header}>
                        <h1>Checkout</h1>
                    </div>

                    <div className={styles.checkoutContent}>
                        <div className={styles.checkoutForm}>
                            {/*Exibe endereço de entrega e opções para voltar ao carrinho ou avançar para pagamento. */}
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
                            {/*Formulário para inserir dados de pagamento com inputs e botões de navegação. */}
                            {step === "payment" && (
                                <div className={styles.paymentSection}>
                                    <h2 className={styles.h2}>Informações de Pagamento</h2>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="name">Nome no Cartão</label>
                                        <input
                                            id="name"
                                            type="text"
                                            defaultValue={cardInfo !== null ? cardInfo.name : ""}
                                            className={styles.input}
                                            name="name"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label} htmlFor="number">Número do Cartão</label>
                                        <input
                                            id="number"
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
                                                id="expDate"
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
                                                id="cvv"
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
                            {/*Exibe resumo do endereço e informações de pagamento. Opções de voltar ou confirmar a compra. */}
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
                        {/*Mostra os itens no carrinho com imagens, quantidade e preços. */}
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
                                {/*Calcula e exibe o total da compra. */}
                                <span>Total: R$ {cart.reduce((acc, product) => acc += product.quantity * product.price, 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            //Se a compra foi finalizada com sucesso, exibe popup de sucesso.
            <div className={styles.successPopupContainer}>
                <SuccessPopup color="blue" title="Compra concluída com sucesso!" msg="Seu produto irá chegar em breve." />
            </div>
        )
    }
}