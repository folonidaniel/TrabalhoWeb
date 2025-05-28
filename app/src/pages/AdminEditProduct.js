import styles from "../styles/AdminEditProduct.module.css";
import SearchBar from "../components/SearchBar";
import AdminNavbar from "../components/AdminNavbar";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router";
import { deleteLoggedUser, readUsers, updateLoggedUser, updateUsers } from "../Utils";
import Loading from "../components/Loading";
import FullPageError from "../components/FullPageError";
import SucessPopup from "../components/SuccessPopup";
import Success from "../components/Success";

export default function AdminEditProduct() {
  const params = useParams();// Hook para acessar parâmetros da rota (id do produto)

  // Estados do componente
  const [product, setProduct] = useState([]);// Armazena dados do produto
  const [addCategory, setAddCategory] = useState(false)
  const [error, setError] = useState(null);// Armazena erro, se houver
  const [success, setSuccess] = useState(false)
  const [exclusionSuccess, setExclusionSuccess] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false);// Indica se os dados foram carregados
  const navigate = useNavigate()// Hook para navegação programática

  useEffect(() => {
    const fetchData = async () => {
      // Busca detalhes do usuário baseado no id da URL
      const response = await fetch(`/mocks/productDetails/${params.id}.json`).catch(() => {
        navigate("/main-admin")
      })
      const fetchedProduct = await response.json().catch(() => {
        navigate("/main-admin")
      })

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

  function handleSearch(event) {
      if (event.key !== "Enter" && event.type !== "click") return
      navigate("/search-products-admin", { state: event.target.value })
  }

  
  function handleEditImage(event){
    let newProduct = {...product}
    newProduct.images[0] = URL.createObjectURL(event.target.files[0])
    setProduct(newProduct)
  }
  
  function handleExclusion(){
    setExclusionSuccess(true)
    setTimeout( () => {
        navigate("/search-products-admin")
    }, 2000)
  }
  function handleCategoryExclusion(event){
      let newProduct = {...product}
      const filteredCategories = newProduct.categories.filter( (category) => category !== event.target.getAttribute("related-category"))
      newProduct.categories = filteredCategories
      setProduct(newProduct)
  }

  function handleKeyDown(event){
      if(event.key !== "Enter") return;
      document.querySelector("span[new-category]").click()
      event.target.value = ""
  }

  function handleAddCategory(){
      const newCategoryElem = document.getElementById("newCategory")
      if(newCategoryElem !== null){
        let newProduct = {...product}
        let newCategories = [...product.categories]
        newCategories.push(newCategoryElem.value)       
        
        newProduct.categories = newCategories
        setProduct(newProduct)
      }
      setAddCategory(true)
  }
  
  function handleSave(){
      let newProduct = {...product}
      const inputs = Array.from(document.getElementsByTagName("input"))
      const tags = Array.from(document.getElementsByTagName("span"))

      newProduct.categories = []
      tags.forEach( (tag) => {
          if(tag.innerText !== "+") newProduct.categories.push(tag.innerText)
      })
      inputs.forEach( (input) => {
        if(input.name === "newCategory") newProduct.categories.push(input.value)
        else newProduct[input.name] = input.value
      })
      setSuccess(true)
      setAddCategory(false)
      setProduct(newProduct)
      setTimeout( () => {
        setSuccess(false)
        navigate("/search-products-admin")
      }, 1500)
  }

  if (!isLoaded) {
    return (
      <Loading />
    )
    // Se houve erro, exibe componente de erro de página inteira
  } else if (error) {
    return (
      <FullPageError title={error.title} message={error.message} />
    )
  } else if(exclusionSuccess) {
      return (
        <div className={styles.exclusionSuccessContainer}>
          <SucessPopup color="blue" title="Produto excluído com sucesso!"/> 
        </div>
      )
  } else if(success){
      return (
        <div className={styles.exclusionSuccessContainer}>
          <SucessPopup color="blue" title="Produto atualizado com sucesso!"/> 
        </div>
      )
  }

  return (
    <div className={styles.pageBg}>
      <AdminNavbar />

      <SearchBar placeholder="Buscar produtos..." initialValue="" marginBottom="20px" width="352px" onClick={handleSearch} onKeyDown={handleSearch} />
      <div className={styles.outerContainer}>
        <div className={styles.card}>
          <div className={styles.cardLeft}>
            <img onClick={() => document.getElementById("imgInput").click()} className={styles.gameImg} src={product.images[0]}/>
            <input onChange={handleEditImage} id="imgInput" style={{display: "none"}} type="file"/>
          </div>
          <div className={styles.cardRight}>
            <input
              type="text"
              name="title"
              defaultValue={product.title}
              className={styles.titleInput}
            />
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Em estoque:</div>
              <input
                type="text"
                name="quantityInStock"
                defaultValue={product.quantityInStock}
                className={styles.infoInput}
              />
            </div>
          </div>
        </div>
        <div className={styles.bottomContainer}>
          <textarea
            className={styles.descTextarea}
            defaultValue={product.description}
            rows={7}
          />
          <div className={styles.tagRow}>
            {product.categories.map((category) => (
              <span key={category} className={styles.tag}> 
                <img related-category={category} className={styles.trash} onClick={handleCategoryExclusion} src="/icons/xmark-blue-solid.svg"/> {category}
              </span>
            ))}
            <div className={styles.containersla}>
            {addCategory && (
              <input
                name="newCategory"
                autoFocus
                id="newCategory"
                className={styles.newCategory}
                placeholder="Adicionar categoria.."
                onKeyDown={handleKeyDown}
              />
            )}
            <span new-category="true" id={styles["addCategoryBtn"]} className={styles.tag} onClick={handleAddCategory}>+</span>
            </div>
          </div>
        </div>
        <div className={styles.buttonRow}>
          <button className={styles.excluirBtn} onClick={handleExclusion}>Excluir</button>
          <button className={styles.salvarBtn} onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
};
