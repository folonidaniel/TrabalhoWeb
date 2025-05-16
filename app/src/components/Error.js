import styles from "../styles/Error.module.css"

export default function Error(props){
    return (
        <div 
            className={styles.errorContainer}>
            <h4>{props.message}</h4>
        </div>
    )
}