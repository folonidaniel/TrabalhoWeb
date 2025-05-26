// Importa funções de navegação e link do React Router
import { useNavigate, useLocation, Link } from "react-router";

// Importa hook de estado do React
import { useState } from "react";

// Importa estilos específicos desse componente usando CSS Modules
import styles from "../styles/Login.module.css";

// Importa funções utilitárias para leitura e atualização de usuários
import { readUsers, updateLoggedUser } from "../Utils";

// Importa componente de erro que ocupa a tela inteira
import FullPageError from "../components/FullPageError";

export function Login() {
  const navigate = useNavigate();// Hook para navegar entre páginas
  const location = useLocation();// Hook para acessar informações da rota atual
  const [validationError, setValidationError] = useState(null);// Estado para erros de validação (ex: email inválido)
  const [requestError, setRequestError] = useState(null)// Estado para erros de requisição (ex: falha ao logar)

  function isValidEmail(email) {
    // Expressão regular para validar email (não aceita espaços, deve ter @ e .)
    const regex = /^\S+@\S+\.\S+$/
    return regex.test(email)// Retorna true se for válido
  }

  async function handleLogin(e) {
    e.preventDefault();// Impede que o formulário recarregue a página

    // Pega os inputs diretamente pelo DOM (não é a melhor prática em React)
    const emailElem = document.getElementsByTagName("input")[0]
    const email = emailElem.value
    const password = document.getElementsByTagName("input")[1].value

    // Se o email for inválido...
    if (!isValidEmail(email)) {
      emailElem.className = styles.invalidInput// Altera estilo para indicar erro
      setValidationError("Email inválido")// Mostra mensagem de erro
      setTimeout(() => {// Após 2 segundos, remove o erro
        emailElem.className = styles.input
        setValidationError(null)
      }, 2000)
      // Interrompe o login
      return
    }
    // Lê a lista de usuários do armazenamento
    let users = await readUsers()

    // Se não houver usuários, inicializa como array vazio
    if (users === null) users = [];
    const userFound = users.find(
      (user) => user.email === email && user.password === password
    );
    // Procura usuário com email e senha correspondentes
    if (userFound === undefined) {
      // Mostra erro
      setValidationError("Email e/ou senha incorretos");
      // Some após 2 segundos
      setTimeout(() => setValidationError(null), 2000);
      return;
    }

    // Se encontrou, tenta atualizar o usuário logado
    await updateLoggedUser(userFound).catch(async () => {
      const error = {// Se falhar, cria um objeto de erro
        title: "Erro interno do servidor.",
        message: "Por favor, tente novamente."
      }
      // Define o erro de requisição
      setRequestError(error)
    })

    // Após login bem-sucedido, redireciona
    if (location.state === null) navigate("/");
    else navigate(location.state);// Se veio de outra página, retorna para ela
  }
   // Se houve erro de requisição, exibe o componente de erro em tela cheia
  if(requestError != null) return (<FullPageError title={requestError.title} message={requestError.message}/>)

  return (
    <>
      <form onSubmit={handleLogin} className={styles.main}>
        {/* Formulário com evento de submit atrelado ao handleLogin */}
        <section id={styles["logo_class"]}>
          <div className={styles.logo}>
            <a href="/">
              <img
                className={styles.img}
                src="icons/gamepad-solid.svg"
                alt="imagem poggers"
              />
            </a>
          </div>
          <h1 className={styles.h1}>Login</h1>
        </section>
        <section id={styles["placeholder_class"]}>
          {validationError === null ? (// Se não tiver erro, não exibe nada
            <></>
          ) : (// Se tiver, mostra a mensagem de erro
            <div className={styles.errorContainer}>
              <h4>{validationError}</h4>
            </div>
          )}
          <div>
            {/*Dois inputs: um para email e outro para senha. Ambos obrigatórios.*/}
            <input
              className={styles.input}
              required
              type="text"
              placeholder="Email:"
            />
          </div>
          <div>
            <input
              className={styles.input}
              required
              type="password"
              placeholder="Senha:"
            />
          </div>
          <div>
            <button id={styles["Login_button"]} type="submit">
              Entrar
            </button>
          </div>
          <p className={styles.p}>
            Ainda não tem uma conta?{" "}
            <Link to="/register" state={location.state} className={styles.a}>
              Cadastre-se
            </Link>
          </p>
        </section>
      </form>
    </>
  );
}
