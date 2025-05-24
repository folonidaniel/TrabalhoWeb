import styles from "../styles/FullPageError.module.css"

export default function FullPageError(props){
    return (
        <div className={styles.errorContainer}>
            <h1 className={styles.title}>{props.title}</h1>
            <span className={styles.message}>{props.message}</span>
            <img className={styles.errorIcon} src="/icons/triangle-exclamation-solid.svg"/>
        </div>
    )
}