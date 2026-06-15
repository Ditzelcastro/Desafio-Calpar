# Como Executar o Projeto Calpar

---

## Pré-requisitos

Antes de tudo, certifique-se de ter o **Node.js 22.5 ou superior** instalado.

Para verificar, abra o terminal e digite:

```bash
node --version
```

---

## Frontend (calpar-frontend-react)

**1. Abra o terminal e entre na pasta do frontend:**

```bash
cd calpar-frontend-react
```

**2. Instale o servidor local (só na primeira vez):**

```bash
npm install -g serve
```

**3. Inicie o frontend:**

```bash
npx serve
```

**4. Acesse no navegador:**

```
http://localhost:3000
```

> A porta exata vai aparecer no terminal após rodar o comando.

---

## Backend (calpar-backend-js)

**1. Abra um NOVO terminal (sem fechar o do frontend) e entre na pasta do backend:**

```bash
cd calpar-backend-js
```

**2. Instale as dependências (só na primeira vez):**

```bash
npm install
```

**3. Inicie o backend:**

```bash
npm start
```

**4. Acesse a documentação Swagger no navegador:**

```
http://localhost:3000/docs
```

---

## Rodando os dois ao mesmo tempo

É necessário ter **dois terminais abertos**, um para cada projeto.

- **Terminal 1** → pasta `calpar-frontend-react` → rodando `npx serve`
- **Terminal 2** → pasta `calpar-backend-js` → rodando `npm start`

> No VS Code, clique no ícone **+** no canto superior direito do terminal para abrir um segundo terminal.

---

## Erro: porta já em uso (EADDRINUSE)

Se aparecer o erro `address already in use :::3000`, significa que a porta já está ocupada.

Rode os comandos abaixo para liberar:

```bash
netstat -ano | findstr :3000
```

Anote o número que aparecer no final da linha (o PID) e rode:

```bash
taskkill /PID <numero> /F
```

Depois tente iniciar novamente.
