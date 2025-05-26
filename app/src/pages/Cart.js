// Importa hooks e componentes necessários
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Loading from "../components/Loading"
import Error from "../components/Error"
import styles from "../styles/Cart.module.css"
import { delay, readCart, updateCart } from "../Utils"
import FullPageError from "../components/FullPageError"

// Define o componente funcional Cart
export function Cart() {
    // Define estados locais para erro, carregamento e dados do carrinho
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [state, setState] = useState(null)
    
     // Executa após a montagem do componente para buscar os dados do carrinho
    useEffect( () => {
        const fetchData = async () => {
            let cart = await readCart()// Lê os dados do carrinho
            if (cart == null) cart = []// Caso não haja dados, inicializa como array vazio
            setState(cart)// Armazena o carrinho no estado
            setIsLoaded(true)// Indica que o carregamento foi concluído
        }
        // Chama a função e trata eventuais erros
        fetchData().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })
    }, [])// Executa apenas uma vez ao montar o componente

     // Função para alterar a quantidade de um produto no carrinho
    async function handleQuantity(operation, productId) {
         // Cria um novo estado do carrinho com base na operação solicitada
        let nextState = state.map((product) => {
            if (product.id == productId) {
                let newProduct = { ...product }
                if (operation === 0) newProduct.quantity = product.quantity - 1
                else newProduct.quantity = product.quantity + 1
                return newProduct
            } else return product
        })

        // Atualiza o carrinho no armazenamento persistente
        await updateCart(nextState).catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })
         // Remove produtos com quantidade zero do carrinho
        nextState = nextState.filter(product => product.quantity != 0)
        // Atualiza o estado local do carrinho
        setState(nextState)
    }

    // Renderiza o componente dependendo do estado de carregamento e erro

    // Enquanto carrega, exibe loading
    
    if(!isLoaded){
        return (
            <>
                <Navbar/>
                <Loading/>
                <Footer/>
            </>
        )
        // Se ocorrer um erro, exibe a tela de erro completa
    } else if(error !== null){
        return (
            <FullPageError title={error.title} message={error.message}/>
        )
    }

     // Se o carrinho possui itens, renderiza-os
    if (state.length > 0)
        return (
            <div className={styles.container}>
                <Navbar></Navbar>

                <main className={styles.main}>
                    {/* Mapeia cada produto para exibir seus detalhes */}
                    {state.map((product) => (
                        <div key={product.id} className={styles.cartItem}>
                            <img src={product.images[0]} className={styles.itemImage} />

                            <div className={styles.itemInfo}>
                                <div className={styles.itemTitle}>{product.title}</div>

                                <div className={styles.quantityControl}>
                                     {/* Se a quantidade for maior que 1, permite diminuir. Senão, exibe ícone de lixeira */}
                                   {product.quantity != 1 ? (
                                        <button
                                            className={styles.quantityButton}
                                            onClick={() => handleQuantity(0, product.id)}>
                                            -
                                        </button>
                                    ) : (
                                       <img className={styles.trash} src="/icons/trash-solid.svg" onClick={() => handleQuantity(0, product.id)}></img>
                                    )}
                                     {/* Se a quantidade for menor que o estoque, permite aumentar */}
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
                            {/* Mostra o preço total do produto com base na quantidade */}
                            <div className={styles.itemPrice}> {(product.price * product.quantity).toFixed(2)} R$ </div>
                        </div>
                    ))}
                </main>
                {/* Mostra o total da compra e o botão para continuar */}
                <hr className={styles.divisionLine} />
                <div className={styles.totalContainer}>
                    <span className={styles.total}>
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
        // Se o carrinho estiver vazio, exibe uma mensagem
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