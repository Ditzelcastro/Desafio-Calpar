module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Calpar - Desafio Backend (Node.js)",
    version: "1.0.0",
    description:
      "API que consome um serviço externo de usuários, salva em SQLite e " +
      "expõe um CRUD completo protegido por autenticação JWT.",
  },
  servers: [{ url: "http://localhost:3000" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      Usuario: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nome: { type: "string", example: "Maria Silva" },
          disponivel: { type: "boolean", example: true },
          criado_em: { type: "string", example: "2026-06-14 12:00:00" },
          atualizado_em: { type: "string", example: "2026-06-14 12:00:00" },
        },
      },
    },
  },
  paths: {
    "/auth/registrar": {
      post: {
        tags: ["Autenticação"],
        summary: "Cria uma conta de acesso",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["usuario", "senha"],
                properties: {
                  usuario: { type: "string", example: "hendrew" },
                  senha: { type: "string", example: "senha123" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Conta criada" }, 409: { description: "Usuário já existe" } },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Faz login e devolve um token JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["usuario", "senha"],
                properties: {
                  usuario: { type: "string", example: "hendrew" },
                  senha: { type: "string", example: "senha123" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Token gerado" }, 401: { description: "Credenciais inválidas" } },
      },
    },
    "/sincronizar": {
      post: {
        tags: ["Sincronização"],
        summary: "Consome a API externa e grava os usuários no banco",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Sincronização concluída" },
          502: { description: "Erro ao consumir a API externa" },
        },
      },
    },
    "/usuarios": {
      get: {
        tags: ["Usuários (CRUD)"],
        summary: "Lista todos os usuários",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Lista de usuários" } },
      },
      post: {
        tags: ["Usuários (CRUD)"],
        summary: "Cria um usuário",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nome"],
                properties: {
                  nome: { type: "string", example: "Maria Silva" },
                  disponivel: { type: "boolean", example: true },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Usuário criado" } },
      },
    },
    "/usuarios/{id}": {
      get: {
        tags: ["Usuários (CRUD)"],
        summary: "Busca um usuário pelo id",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Usuário" }, 404: { description: "Não encontrado" } },
      },
      put: {
        tags: ["Usuários (CRUD)"],
        summary: "Atualiza um usuário",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nome: { type: "string" },
                  disponivel: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Usuário atualizado" }, 404: { description: "Não encontrado" } },
      },
      delete: {
        tags: ["Usuários (CRUD)"],
        summary: "Remove um usuário",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 204: { description: "Removido" }, 404: { description: "Não encontrado" } },
      },
    },
  },
};
