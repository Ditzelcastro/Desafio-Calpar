window.Calpar = window.Calpar || {};

Calpar.api = (function () {
  const URL = "https://09441c3d-9208-4fa9-a576-ba237af6b17c.mock.pstmn.io/";
  const MENSAGEM_SUCESSO = "Sucesso ao Encontrar usuário.";

  function getCI(obj, ...chaves) {
    if (!obj || typeof obj !== "object") return undefined;
    const m = {};
    for (const k of Object.keys(obj)) m[k.toLowerCase()] = obj[k];
    for (const c of chaves) if (c.toLowerCase() in m) return m[c.toLowerCase()];
    return undefined;
  }

  async function buscarUsuarios() {
    let resposta;
    try {
      resposta = await fetch(URL);
    } catch (e) {
      throw new Error("Não foi possível conectar à API. Verifique sua internet.");
    }

    if (!resposta.ok) {
      throw new Error(`A API respondeu com status ${resposta.status}.`);
    }

    let dados;
    try {
      dados = await resposta.json();
    } catch {
      throw new Error("A API não retornou um JSON válido.");
    }

    const mensagem = getCI(dados, "Msg", "message", "mensagem", "status") || "";
    if (mensagem !== MENSAGEM_SUCESSO) {
      throw new Error(
        `Mensagem inesperada da API: "${mensagem || "sem mensagem"}". ` +
          `Esperado: "${MENSAGEM_SUCESSO}".`
      );
    }

    const lista = getCI(dados, "Dados", "data", "usuarios", "results", "users") || [];
    return lista.map((item) => ({
      nome: getCI(item, "Nome", "name", "usuario") ?? "—",
      disponivel: Boolean(getCI(item, "Disponivel", "disponivel", "available", "ativo")),
    }));
  }

  return { buscarUsuarios, URL, MENSAGEM_SUCESSO };
})();
