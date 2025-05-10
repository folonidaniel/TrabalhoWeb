import styles from '../styles/SearchBar.module.css'

export default function SearchBar(){
    return (
        <div id={styles['search-container']}>
          <img
            id={styles['search-icon']}
            src="icons/magnifying-glass-solid.svg"
            alt="Busca"
          />
          <input id={styles['search-bar']} type="text"/>
        </div>
    )
}