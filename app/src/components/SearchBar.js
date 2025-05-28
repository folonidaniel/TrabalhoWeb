import styles from '../styles/SearchBar.module.css'

export default function SearchBar(props){
    return (
        <div id={styles['search-container']} style={{width: `${props.width}`, marginTop: `${props.marginTop}`, marginBottom: `${props.marginBottom}`}} >
          <img
            id={styles['search-icon']}
            src="/icons/magnifying-glass-solid.svg"
            alt="Busca"
            onClick={props.onClick}
          />
          <input 
            style={{width: `${props.width}`}}
            placeholder={props.placeholder}
            defaultValue={props.initialValue} 
            id={styles['search-bar']} 
            onChange={props.onChange}
            onKeyDown={props.onKeyDown}
            type="text"/>
        </div>
    )
}