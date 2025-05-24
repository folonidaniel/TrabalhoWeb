import styles from "../styles/SuccessPopup.module.css"

export default function SucessPopup(props) {
    if (props.color === "white") {
        return (
            <div className={styles.containerWhite}>
                <img className={styles.img} src="/icons/success-blue.svg"/>
                <h1 className={styles.titleBlue}>{props.title}</h1>
                <span className={styles.msgBlue}>{props.msg}</span>
            </div>
        )
    } else {
        return (
            <div className={styles.containerBlue}>
                <img className={styles.img} src="/icons/success-white.svg"/>
                <h1 className={styles.titleWhite}>{props.title}</h1>
                <span className={styles.msgWhite}>{props.msg}</span>
            </div>
        )
    }

}