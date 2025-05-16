import styles from "../styles/Success.module.css"

export default function Success(props){
    return (
        <div className={styles.successContainer}>
            <h4>{props.message}</h4>
        </div>
    )
}