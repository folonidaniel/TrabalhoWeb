import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import styles from "../styles/AboutUs.module.css"

export default function AboutUs(){
    return (
        <>
            <Navbar></Navbar>
            <main className={styles.main}>
                <h2 className={styles.title}>LojaDeGames 3000</h2>
                <p className={styles.p}>
                    Na LojaDeGames 3000, nossa missão é transformar cada visita em uma verdadeira jornada pelo universo dos games. Fundada por apaixonados por videogames, oferecemos uma seleção dos principais jogos — tudo com curadoria feita por quem entende do assunto. Seja você um gamer de longa data, um entusiasta casual ou alguém em busca do presente perfeito, aqui você encontra uma comunidade vibrante que compartilha da mesma paixão. A LojaDeGames 3000 é mais do que uma loja — é um ponto de encontro para quem vive e respira jogos.
                </p>
                <img className={styles.logoIcon} src="/icons/gamepad-solid-blue.svg" alt="Logo"/>
            </main>
            <Footer/>
        </>
    )
}