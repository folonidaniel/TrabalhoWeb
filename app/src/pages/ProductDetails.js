// Importação de hooks do React Router e React
import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
// Importação de componentes e estilos
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/ProductDetails.module.css";
// Importação de funções utilitárias e componentes auxiliares
import { readLoggedUser, readCart, updateCart } from "../Utils"
import Loading from "../components/Loading";
import FullPageError from "../components/FullPageError";

// Componente principal de detalhes do produto
export default function ProductDetails() {
    const params = useParams();// Hook para acessar parâmetros da rota (id do produto)

    // Estados do componente
    const [product, setProduct] = useState([]);// Armazena dados do produto
    const [error, setError] = useState(null);// Armazena erro, se houver
    const [isLoaded, setIsLoaded] = useState(false);// Indica se os dados foram carregados
    const [quantity, setQuantity] = useState(1)// Quantidade selecionada para compra
    const navigate = useNavigate()// Hook para navegação programática

    // Efeito para buscar dados do produto ao montar o componente
    useEffect(() => {
        const fetchData = async () => {
            // Busca detalhes do produto baseado no id da URL
            const response = await fetch(`/mocks/productDetails/${params.id}.json`)
            const fetchedProduct = await response.json()
            setIsLoaded(true);
            setProduct(fetchedProduct);
        }
        // Tratamento de erro na busca de dados
        fetchData().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })
    }, [])

    // Função para adicionar o produto ao carrinho
    async function handleCart() {
        // Busca usuário logado
        const loggedUser = await readLoggedUser().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        // Busca o carrinho do usuário
        let cart = await readCart().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        if (cart == null) cart = [] // Se o carrinho for nulo, inicializa como array vazio

        let updatedProductQuantity = false
         // Atualiza a quantidade se o produto já estiver no carrinho
        cart = cart.map((item) => {
            if (item.id == params.id) {
                updatedProductQuantity = true
                let newProduct = { ...item }
                newProduct.quantity += quantity
                return newProduct
            }
            return item
        })
        // Se o produto não estiver no carrinho, adiciona com a quantidade selecionada
        if (!updatedProductQuantity) {
            let newProduct = { ...product }
            newProduct.quantity = quantity
            cart.push(newProduct)
        }
         // Atualiza o carrinho
        await updateCart(cart).catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        // Redireciona conforme o estado do usuário (logado ou não)
        if (loggedUser == null) {
            navigate("/login", { state: "/cart" })// Redireciona para login
        } else {
            navigate("/cart")// Redireciona para o carrinho
        }
    }

    // Função para comprar o produto imediatamente
    async function handleBuyNow() {
        // Busca usuário logado
        const loggedUser = await readLoggedUser().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        if (loggedUser == null) {// Se não logado, redireciona para login
            navigate("/login")
            return;
        }

         // Busca o carrinho do usuário
        let cart = await readCart().catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        if (cart == null) cart = []
        // Atualiza a quantidade se o produto já estiver no carrinho
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
         // Se não estiver no carrinho, adiciona o produto
        if (!updatedProductQuantity) {
            let newProduct = { ...product }
            newProduct.quantity = quantity
            cart.push(newProduct)
        }
        // Atualiza o carrinho
        await updateCart(cart).catch(async () => {
            setIsLoaded(true)
            const error = {
                title: "Erro interno do servidor.",
                message: "Por favor, tente novamente."
            }
            setError(error)
        })

        navigate("/checkout")// Redireciona para o checkout
    }

     // Se os dados ainda não foram carregados, exibe componente de loading
    if (!isLoaded){
        return (
            <Loading/>
        )
         // Se houve erro, exibe componente de erro de página inteira
    } else if(error){
        return (
            <FullPageError title={error.title} message={error.message}/>
        )
    }
        
    // Renderização do componente com detalhes do produto
    return (
        <>
            <Navbar></Navbar>
            <div className={styles.container}>
                <main className={styles.mainContent}>
                    <div className={styles.productImages}>
                        <img className={styles.mainImage} src={product.images[0]}></img>
                        <div className={styles.thumbnails}>
                            {/* Miniaturas de imagens - ainda não implementadas */}
                            <img className={styles.thumbnail}></img>
                            <img className={styles.thumbnail}></img>
                            <img className={styles.thumbnail}></img>
                            <img className={styles.thumbnail}></img>
                            <img className={styles.thumbnail}></img>
                        </div>
                        <div className={styles.categories}>
                             {/* Renderiza categorias do produto */}
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
                                {/* Controle de quantidade */}
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
                             {/* Botões de ação */}
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
