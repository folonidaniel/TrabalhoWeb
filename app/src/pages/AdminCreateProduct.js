import styles from "../styles/AdminCreateProduct.module.css";
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
  const [image, setImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [addCategory, setAddCategory] = useState(false)
  const [error, setError] = useState(null);// Armazena erro, se houver
  const [success, setSuccess] = useState(false)
  const [exclusionSuccess, setExclusionSuccess] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false);// Indica se os dados foram carregados
  const navigate = useNavigate()// Hook para navegação programática

  function handleSearch(event) {
      if (event.key !== "Enter" && event.type !== "click") return
      navigate("/search-products-admin", { state: event.target.value })
  }
  
  const handleImageUpload = (event) => setImage(URL.createObjectURL(event.target.files[0]))
  
  const handleCategoryExclusion = (event) => {
      const newCategories = categories.filter( (category) => category !== event.target.getAttribute("related-category"))
      setCategories(newCategories)
    
      if(categories.length-1 === 0) setAddCategory(false)
  }
  
  function handleAddCategory(){
      const newCategoryElem = document.getElementById("newCategory")
      if(newCategoryElem !== null){
        let newCategories = [...categories]
        newCategories.push(newCategoryElem.value)       
        setCategories(newCategories)
      }
      setAddCategory(true)
  }
  
  function handleKeyDown(event){
      if(event.key !== "Enter") return;
      document.querySelector("span[new-category]").click()
      event.target.value = ""
  }

  function handleCreate(event){
      event.preventDefault()

      let newProduct = {}
      const inputs = Array.from(document.getElementsByTagName("input"))
      const description = document.getElementsByTagName("textarea")[0]
      const tags = Array.from(document.getElementsByTagName("span"))
      newProduct.categories = []
      tags.forEach( (tag) => {
          if(tag.innerText !== "+") newProduct.categories.push(tag.innerText)
      })
      inputs.forEach( (input) => {
        if(input.name !== "newCategory") newProduct[input.name] = input.value
      })
      newProduct[description.name] = description.value
      setSuccess(true)
      setAddCategory(false)
      console.log(newProduct)
      setTimeout( () => {
        setSuccess(false)
      }, 1500)
  }

  return (
    <div className={styles.pageBg}>
      <AdminNavbar />

      <SearchBar placeholder="Buscar produtos..." initialValue="" marginBottom="20px" width="352px" onClick={handleSearch} onKeyDown={handleSearch} />
      {success && (
        <div className={styles.successContainer}>
          <Success message="Produto atualizado com sucesso!"/>
        </div>
      )}
      <div className={styles.outerContainer}>
        <div className={styles.card}>
          <div className={styles.cardLeft}>
            <img 
              onClick={() => document.getElementById("imgInput").click()} 
              className={styles.gameImg}
              style={image === null
                      ? {width: "160px", height: "160px"}
                      : {aspectRatio: "auto", width: "80%", height: "initial", border: "2px solid #00FFFF"}}
              src={image === null ? "/icons/plus-solid.svg" : image}/>
            <input onChange={handleImageUpload} id="imgInput" style={{display: "none"}} type="file"/>
          </div>
          <div className={styles.cardRight}>
            <input
              type="text"
              name="title"
              placeholder="Título..."
              form-input="true"
              className={styles.titleInput}
            />
            <div className={styles.infoRow}>
              <input
                type="text"
                placeholder="Estoque..."
                name="quantityInStock"
                form-input="true"
                className={styles.infoInput}
              />
            </div>
          </div>
        </div>
        <div className={styles.bottomContainer}>
          <textarea
            className={styles.descTextarea}
            name="description"
            placeholder="Descrição..."
            form-input="true"
            rows={7}
          />
          <div className={styles.tagRow}>
            {categories.map((category) => (
              <span key={category} className={styles.tag}> 
                <img related-category={category} className={styles.trash} onClick={handleCategoryExclusion} src="/icons/xmark-blue-solid.svg"/> {category}
              </span>
            ))}
            <div className={styles.containersla}>
            {addCategory && (
              <input
                name="newCategory"
                id="newCategory"
                autoFocus
                className={styles.newCategory}
                placeholder="Adicionar categoria.."
                onKeyDown={handleKeyDown}
              />
            )}
            <span 
              new-category="true"
              id={styles["addCategoryBtn"]} 
              className={styles.tag} 
              onClick={handleAddCategory}
              >+</span>
            </div>
          </div>
        </div>
        <div className={styles.buttonRow}>
          <button className={styles.salvarBtn} onClick={handleCreate}>Cadastrar</button>
        </div>
      </div>
    </div>
  );
};

