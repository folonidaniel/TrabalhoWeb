# Relatório

Felipe Ferreira Colona - NUSP 15636525 </br>
Daniel Mistieri Foloni - NUSP 15446899 </br>

### Requisitos
Além dos requisitos pré-estabelecidos, o projeto inclui os seguintes novos requisitos:
- Os registros de produtos incluem os gêneros de jogos aos quais eles pertencem.
- Cada registro de produto pode estar relacionado a múltiplas fotos.
- Filtragem por gênero de jogos.
- Usuários comuns (não administradores) também são capazes de alterar suas informações de conta.
- Usuários são capazes de comprar um produto diretamente (sem adicioná-lo no carrinho).
### Descrição do Projeto
O projeto se trata de um trabalho da disciplina SCC0219 - Introdução ao Desenvolvimento Web do Instituto de Ciências Matemáticas e de Computação (ICMC) da Universidade de São Paulo (USP). Nele foi requisitado que desenvolvêssemos um e-commerce de nossa escolha. Assim, decidimos elaborar uma loja online de jogos físicos que inclua todo o processo de um e-commerce, desde a criação da conta até a finalização da compra. Esta é a primeira entrega do trabalho, em que fizemos o mockup das páginas web (algumas no Figma e outras em HTML e CSS). Desse modo, conforme as entregas ocorram, esse repositório será atualizado.

Nesse contexto, o sistema possui dois tipos de usuários: usuários comuns e administradores. Inicialmente, os usuários comuns precisam se cadastrar na página _register_ (onde fornecem nome, endereço, e-mail e senha) antes de começarem a navegar. No entanto, o admin já possui uma conta criada por padrão e pode, manualmente, criar novas contas na página restrita _admin-create-user_. Após isso, ambos fazem login na página _login_ e são redirecionados a suas respectivas páginas principais: _main_ e _admin-main_. 

Na página principal do usuário ele é capaz de buscar jogos pelo título na barra de pesquisa (que irá redirecioná-lo à página _search_), buscar jogos pelo gênero que estão dispostos em um slide, conhecer mais sobre a empresa na página _about-us_ via navbar, ver/alterar os detalhes/sair de sua conta na página _my-account_ via navbar ou ver os itens adicionados ao carrinho também pela navbar. Ao se interessar por um jogo em específico, tanto na _main_ quanto na _search_, o usuário pode ver mais detalhes do jogo ao clicar e ser redirecionado à página _product-details_, onde é possível ver o título, descrição, fotos, gêneros em que se enquadra e, finalmente, comprá-lo (o redirecionará ao _checkout_) ou adicioná-lo ao carrinho (o redirecionará ao _cart_). No carrinho, o usuário poderá revisar os itens que irá comprar, alterar a quantidade ou removê-los. Enfim, no _checkout_, o usuário preencherá as informações do meio de pagamento e concluirá a compra.

Na página principal do administrador, ele poderá, através da navbar, acessar as seguintes páginas: _admin-search-products_, _admin-create-product_, _admin-edit-product_, _admin-search-users_, _admin-create-user_, _admin-edit-user_. Nas páginas de busca, o admin poderá, pela barra de busca, procurar produtos/usuários previamente cadastrados e ser redirecionado às respectivas páginas de edição. Nas páginas de edição, o admin poderá editar propriedades dos produtos/usuários (como título, quantidade em estoque, foto e descrição / nome, telefone, privilégio de administrador, etc) e removê-los. Por fim, nas páginas de criação, o admin poderá cadastrar novos produtos/usuários. 

#### Diagrama de Navegação
![Diagrama de Navegação](https://raw.github.com/fcolona/TrabalhoWeb/main/figma-mockups/navigation-diagram.svg)


### Comentários Sobre o Código
Estrutura de Pastas:
- views: arquivos HTML
- styles: arquivos CSS
- assets: arquivos de imagem 
- assets/figma-mockups: imagens dos mockups (desktop e mobile) desenvolvidos no Figma
- assets/game-imgs: imagens de capa e de banner dos jogos cadastrados (créditos dados nas páginas em que aparecem)
- assets/icons: ícones do FontAwesome em formato SVG

### Plano de Teste

### Resultado dos Testes

### Procedimentos de Build

### Problemas

### Comentários
