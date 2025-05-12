import styles from "../styles/Main.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";

export function Main() {
  return (
    <>
      <Navbar></Navbar>
      <div className={styles["center-containers"]}>
        <div id={styles["banner-container"]}>
          <img
            id={styles["banner"]}
            src="/game-imgs/hollow-knight-banner.png"
            alt=""
          />
          <img
            id={styles["circle1"]}
            className={styles["circles"]}
            src="/icons/circle.svg"
            alt=""
          />
          <img
            id={styles["circle2"]}
            className={styles["circles"]}
            src="/icons/selected-circle.svg"
            alt=""
          />
          <img
            id={styles["circle3"]}
            className={styles["circles"]}
            src="/icons/circle.svg"
            alt=""
          />
        </div>
      </div>
      <div className={styles["center-containers"]}>
        <SearchBar></SearchBar>
      </div>
      <h3 className={styles["category-titles"]}>Plataforma</h3>
      <div className={styles["category"]}>
        <img
          className={styles["less"]}
          src="/icons/less-than-solid.svg"
          alt="Voltar"
        />
        <div className={styles["container-cover-arts"]}>
          <img
            className={styles["cover-art"]}
            src="/game-imgs/celeste.jpg"
            alt=""
          />
          <h4 className={styles["game-titles"]}>Celeste</h4>
        </div>
        <div className={styles["container-cover-arts"]}>
          <img
            className={styles["cover-art"]}
            src="/game-imgs/dead-cells.png"
            alt=""
          />
          <h4 className={styles["game-titles"]}>Dead Cells</h4>
        </div>
        <div className={styles["container-cover-arts"]}>
          <img
            className={styles["cover-art"]}
            src="/game-imgs/cuphead.png"
            alt=""
          />
          <h4 className={styles["game-titles"]}>Cuphead</h4>
        </div>
        <div className={styles["container-cover-arts"]}>
          <img
            className={styles["cover-art"]}
            src="/game-imgs/unravel.jpg"
            alt=""
          />
          <h4 className={styles["game-titles"]}>Unravel</h4>
        </div>
        <div className="last-cover-art-container">
          <img
            className={styles["cover-art"]}
            src="/game-imgs/ori-and-the-blind-forest.jpg"
            alt=""
          />
          <h4 className={styles["game-titles"]}>Ori and the Blind Forest</h4>
        </div>
        <img
          className={styles["greater"]}
          src="/icons/greater-than-solid.svg"
          alt="Voltar"
        />
      </div>
      <h3 className={styles["category-titles"]}>Roguelike</h3>
      <div className={styles["category"]}>
        <img
          className={styles["less"]}
          src="/icons/less-than-solid.svg"
          alt="Voltar"
        />
        <div className={styles["container-cover-arts"]}>
          <img
            className={styles["cover-art"]}
            src="/game-imgs/hades.jpg"
            alt=""
          />
          <h4 className={styles["game-titles"]}>Hades</h4>
        </div>
        <div className={styles["container-cover-arts"]}>
          <img
            className={styles["cover-art"]}
            src="/game-imgs/children-of-morta.jpg"
            alt=""
          />
          <h4 className={styles["game-titles"]}>Children of Morta</h4>
        </div>
        <div className={styles["container-cover-arts"]}>
          <img
            className={styles["cover-art"]}
            src="/game-imgs/dead-cells.png"
            alt=""
          />
          <h4 className={styles["game-titles"]}>Dead Cells</h4>
        </div>
        <div className={styles["container-cover-arts"]}>
          <img
            className={styles["cover-art"]}
            src="/game-imgs/neon-abyss.jpg"
            alt=""
          />
          <h4 className={styles["game-titles"]}>Neon Abyss</h4>
        </div>
        <div className="last-cover-art-container">
          <img
            className={styles["cover-art"]}
            src="/game-imgs/the-binding-of-isaac.jpg"
            alt=""
          />
          <h4 className={styles["game-titles"]}>The Binding of Isaac</h4>
        </div>
        <img
          className={styles["greater"]}
          src="/icons/greater-than-solid.svg"
          alt="Voltar"
        />
      </div>
      <h3 className={styles["category-titles"]}>RPG</h3>
      <div className={styles["category"]}>
        <img
          className={styles["less"]}
          src="/icons/less-than-solid.svg"
          alt="Voltar"
        />
        <div className={styles["container-cover-arts"]}>
          <img
            className={styles["cover-art"]}
            src="/game-imgs/skyrim.jpg"
            alt=""
          />
          <h4 className={styles["game-titles"]}>Skyrim</h4>
        </div>
        <div className={styles["container-cover-arts"]}>
          <img
            className={styles["cover-art"]}
            src="/game-imgs/dark-souls3.jpg"
            alt=""
          />
          <h4 className={styles["game-titles"]}>Dark Souls 3</h4>
        </div>
        <div className={styles["container-cover-arts"]}>
          <img
            className={styles["cover-art"]}
            src="/game-imgs/fallout-nv.jpg"
            alt=""
          />
          <h4 className={styles["game-titles"]}>Fallout New Vegas</h4>
        </div>
        <div className={styles["container-cover-arts"]}>
          <img
            className={styles["cover-art"]}
            src="/game-imgs/fallout3.jpg"
            alt=""
          />
          <h4 className={styles["game-titles"]}>Fallout 3</h4>
        </div>
        <div className="last-cover-art-container">
          <img
            className={styles["cover-art"]}
            src="/game-imgs/fallout4.jpg"
            alt=""
          />
          <h4 className={styles["game-titles"]}>Fallout4</h4>
        </div>
        <img
          className={styles["greater"]}
          src="/icons/greater-than-solid.svg"
          alt="Voltar"
        />
      </div>
      <Footer></Footer>
    </>
  );
}
