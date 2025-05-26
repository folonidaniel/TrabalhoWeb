// Importa os estilos específicos do componente Register
import styles from "../styles/Register.module.css"

// Importa hooks de navegação e localização de rota
import { useNavigate, useLocation, Link } from "react-router-dom"

// Importa hooks de navegação e localização de rota
import { useState } from "react"

// Importa componentes auxiliares para mensagens de sucesso e erro
import SucessPopup from "../components/SuccessPopup"
import Error from "../components/Error"

// Importa funções utilitárias para validação e manipulação de dados
import { isValidEmail, isValidPhone, readUsers, updateUsers } from "../Utils"

// Importa componente para exibir erros de sistema
import FullPageError from "../components/FullPageError"

export function Register() {
   // Hook de navegação para redirecionar o usuário
  const navigate = useNavigate()

  // Hook que fornece informações sobre a rota atual
  const location = useLocation()

  // Estado para gerenciar erro de validação dos campos
  const [validationError, setValidationError] = useState(null);

  // Estado para gerenciar erros de requisição (ex: falha ao acessar o servidor)
  const [requestError, setRequestError] = useState(null);

  // Estado que indica se o cadastro foi finalizado com sucesso
  const [hasFinished, setFinished] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()// Evita o comportamento padrão do formulário (recarregar a página)

     // Captura todos os elementos input do formulário
    const inputs = Array.from(document.getElementsByTagName("input"))

    // Referências específicas para os campos de email e telefone
    const emailElem = document.getElementsByTagName("input")[3]
    const phoneElem = document.getElementsByTagName("input")[2]

     // Variáveis de controle para validação
    let hasInvalidInput = false
    let errorMsg = ""
    if (!isValidEmail(emailElem.value)) {
      emailElem.className = styles.invalidInput
      hasInvalidInput = true
      errorMsg += "Email inválido"
    }
    if (!isValidPhone(phoneElem.value)) {
      phoneElem.className = styles.invalidInput
      if (hasInvalidInput) errorMsg += " e "
      errorMsg += "Telefone inválido"
      hasInvalidInput = true
    }
    if (hasInvalidInput) {
       // Após 2 segundos, remove a indicação de erro e a mensagem
      setValidationError(errorMsg)
      setTimeout(() => {
        emailElem.className = styles.input
        phoneElem.className = styles.input
        setValidationError(null)
      }, 2000)
      return
    }

    let newUser = {}
    inputs.forEach((input) => {
      newUser[input.name] = input.value
    })

    //Leitura dos usuários cadastrados:
    let users = await readUsers().catch(async () => {
          const error = {
              title: "Erro interno do servidor.",
              message: "Por favor, tente novamente."
          }
          setRequestError(error)
    })

    //Atualiza o cadastro de usuários com o novo usuário:
    if (users === null) users = []
    await updateUsers([...users, newUser]).catch(async () => {
          const error = {
              title: "Erro interno do servidor.",
              message: "Por favor, tente novamente."
          }
          setRequestError(error)
    })

   //Indica que o cadastro foi finalizado e redireciona após 2 segundos:
    setFinished(true)
    setTimeout(() => {
      navigate("/login", { state: location.state })
    }, 2000);
  }
  
  //Se ocorreu um erro na requisição, exibe a tela de erro:
  if(requestError !== null) return (<FullPageError title={requestError.title} message={requestError.message}/>)

    //Renderização do formulário de cadastro se não foi finalizado:
  if (!hasFinished) {
    return (
      <>
        <form onSubmit={handleRegister} action="/create/user" method="POST" className={styles.main}>
          <section id={styles['logo_class']}>
            <div className="logo">
              <a href="/">
                <img className={styles.img} src="icons/gamepad-solid.svg" alt="imagem poggers" />
              </a>
            </div>
            <h1 className={styles.h1}>Cadastro</h1>
          </section>
          <section id={styles['placeholder_class']}>
            {validationError !== null ? (
              <Error message={validationError}/>
            ) : (
              <></>
            )}
            <div>
              {/* Campos de input para o cadastro*/}
              <input className={styles.input} required name="name" type="text" placeholder="Nome:" />
            </div>
            <div>
              <input className={styles.input} required name="address" type="text" placeholder="Endereço:" />
            </div>
            <div>
              <input className={styles.input} required name="phone" type="text" placeholder="Telefone:" />
            </div>
            <div>
              <input className={styles.input} required name="email" type="text" placeholder="Email:" />
            </div>
            <div>
              <input className={styles.input} required name="password" type="password" placeholder="Senha:" />
            </div>
            <div>
              {/*Botão de cadastro e link para login*/}
              <button id={styles['Cadastro_button']} type="submit">
                Cadastrar
              </button>
            </div>
            <p className={styles.p}>
              Já possui uma conta? <Link to="/login" state={location.state} className={styles.a}>Faça login</Link>
            </p>
          </section>
        </form>
      </>
    )
  } else {
    return (
      //Se o cadastro foi finalizado, exibe o popup de sucesso:
      <main className={styles.main}>
          <SucessPopup color="white" title="Cadastro realizado com sucesso!" msg="Por favor, faça login para começar suas compras" />
      </main>
    )
  }
}
