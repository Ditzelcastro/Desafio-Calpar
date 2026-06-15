# Calpar — Desafio Frontend (React)

Aplicação desenvolvida em React que consome a API de usuários da Calpar, exibe a lista de nomes com o respectivo status de disponibilidade e trata as mensagens de erro retornadas pela API. Como funcionalidade adicional, utiliza a API nativa de armazenamento local (localStorage) do navegador.

---

## Estrutura do projeto

```
calpar-frontend-react/
├── index.html                  # Página base; carrega React, Babel e os scripts
├── css/
│   └── style.css               # Estilos da aplicação
└── src/
    ├── api.js                  # Consumo da API e tratamento de erro
    ├── storage.js              # Armazenamento local (localStorage)
    ├── components/
    │   ├── UserCard.jsx        # Card individual de um usuário
    │   └── UserList.jsx        # Renderização da lista de cards
    ├── App.jsx                 # Componente principal: estado e orquestração
    └── index.jsx               # Ponto de entrada; monta o App na página
```

---

## Como funciona

### Tecnologias

A aplicação utiliza **React 18** carregado via CDN e **Babel Standalone** para interpretação do JSX diretamente no navegador, dispensando qualquer etapa de build ou empacotador. Os componentes estão organizados em arquivos `.jsx` separados por responsabilidade.

### Consumo da API

O módulo `src/api.js` é responsável por realizar a requisição à API e tratar a resposta. O fluxo executado é o seguinte:

1. A requisição é feita à URL da API por meio do `fetch`.
2. Caso a conexão falhe, o status HTTP não seja válido ou o conteúdo não seja um JSON válido, um erro é lançado.
3. A mensagem retornada pela API é verificada. Se for diferente de `"Sucesso ao Encontrar usuário."`, um erro é lançado.
4. Quando a resposta é válida, os dados são normalizados e retornados como uma lista de objetos no formato `{ nome, disponivel }`.

A leitura das chaves é feita de forma insensível a maiúsculas e minúsculas, garantindo compatibilidade com as variações do contrato da API (`Msg`, `Dados`, `Nome`, `Disponivel`).

### Exibição e tratamento de erro

O componente `App.jsx` controla o estado da aplicação utilizando os hooks `useState` e `useEffect`. Ao ser carregado, ele solicita os dados ao módulo de API e define um dos seguintes comportamentos:

- **Sucesso:** a lista é repassada ao componente `UserList`, que renderiza um `UserCard` para cada usuário, apresentando o nome e um indicador visual de status (Disponível ou Indisponível).
- **Erro:** uma mensagem de erro é exibida em um banner destacado, conforme exigido pelo enunciado.

### Armazenamento local (funcionalidade adicional)

O módulo `src/storage.js` utiliza o **localStorage** do navegador. A cada consulta bem-sucedida, a lista de usuários é armazenada localmente. Caso uma consulta posterior falhe, a aplicação exibe os últimos dados salvos, juntamente com a data do registro, evitando uma tela vazia.

