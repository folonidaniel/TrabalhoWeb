import styles from '../styles/SearchBar.module.css'

export default function SearchBar(props){
    return (
        <div id={styles['search-container']} style={{width: `${props.width}`, marginTop: `${props.marginTop}`}} >
          <img
            id={styles['search-icon']}
            src="/icons/magnifying-glass-solid.svg"
            alt="Busca"
            onClick={props.onClick}
          />
          <input 
            style={{width: `${props.width}`}}
            defaultValue={props.initialValue} 
            id={styles['search-bar']} 
            onChange={props.onChange}
            onKeyDown={props.onKeyDown}
            type="text"/>
        </div>
    )
}