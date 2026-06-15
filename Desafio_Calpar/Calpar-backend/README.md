# Calpar — Desafio Backend (Node.js + Express)

Serviço backend que consome a API de usuários da Calpar, armazena os dados em um banco de dados SQLite e disponibiliza operações CRUD por meio de endpoints HTTP. Implementa, ainda, autenticação via JWT para proteção das rotas e documentação interativa com Swagger.

---

## Estrutura do projeto

```
calpar-backend-js/
├── package.json                # Metadados e dependências do projeto
├── .env.example                # Exemplo de variáveis de ambiente
└── src/
    ├── server.js               # Inicialização do servidor Express e Swagger
    ├── config.js               # Carregamento das configurações (.env)
    ├── db.js                   # Conexão com o SQLite e criação das tabelas
    ├── auth.js                 # Hash de senha, geração de JWT e middleware
    ├── externalApi.js          # Consumo da API externa e persistência
    ├── swagger.js              # Especificação OpenAPI (documentação)
    └── routes/
        ├── authRoutes.js       # Rotas de autenticação (registro e login)
        ├── usuariosRoutes.js   # Operações CRUD dos usuários
        └── syncRoutes.js       # Sincronização com a API externa
```

---

## Como funciona

### Tecnologias

O projeto utiliza **Node.js** com o framework **Express** para a construção da API. A persistência é feita com o **SQLite nativo do Node** (módulo `node:sqlite`), o que dispensa qualquer dependência de compilação. A autenticação utiliza **jsonwebtoken** e **bcryptjs**, e a documentação é gerada com **swagger-ui-express**.

### Banco de dados

O arquivo `src/db.js` estabelece a conexão com o SQLite e cria, caso não existam, duas tabelas:

- **contas:** armazena os usuários do sistema (login e senha criptografada) utilizados na autenticação.
- **usuarios:** armazena os dados provenientes da API externa (nome e disponibilidade), sobre os quais o CRUD é executado.

### Consumo da API externa

O arquivo `src/externalApi.js` é responsável por consumir a API e persistir os dados:

1. A requisição é realizada à URL configurada.
2. A mensagem retornada é validada. Se for diferente de `"Sucesso ao Encontrar usuário."`, a operação é interrompida e o endpoint responde com erro HTTP 502.
3. Sendo a resposta válida, os usuários são gravados no banco. Caso um nome já exista, seu status é atualizado; caso contrário, um novo registro é inserido.

Essa rotina é acionada pela rota `POST /sincronizar`, definida em `src/routes/syncRoutes.js`.

### Implementação do CRUD

As operações CRUD estão implementadas no arquivo **`src/routes/usuariosRoutes.js`**, sobre a tabela `usuarios`. Todas as rotas são protegidas pelo middleware de autenticação. O mapeamento das operações é o seguinte:

| Operação | Método e rota | Descrição |
|----------|---------------|-----------|
| **Create** | `POST /usuarios` | Insere um novo usuário no banco. |
| **Read** | `GET /usuarios` | Retorna a lista de todos os usuários. |
| **Read** | `GET /usuarios/:id` | Retorna um usuário específico pelo identificador. |
| **Update** | `PUT /usuarios/:id` | Atualiza os dados de um usuário existente. |
| **Delete** | `DELETE /usuarios/:id` | Remove um usuário do banco. |

Cada operação utiliza comandos SQL preparados (prepared statements) executados sobre o banco SQLite definido em `src/db.js`.

### Autenticação

O arquivo `src/auth.js` concentra a lógica de segurança: criptografia de senha com bcrypt, geração e validação de tokens JWT e o middleware que protege as rotas. As rotas de registro e login estão definidas em `src/routes/authRoutes.js`. Para acessar as operações CRUD, é necessário autenticar-se e enviar o token recebido no cabeçalho `Authorization: Bearer <token>`.

### Documentação

A documentação interativa é gerada automaticamente pelo Swagger e fica disponível na rota `/docs`. A especificação está definida em `src/swagger.js`. Pela interface, é possível autenticar-se e testar todos os endpoints.

