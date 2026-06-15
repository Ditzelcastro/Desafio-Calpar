window.Calpar = window.Calpar || {};

Calpar.storage = (function () {
  const CHAVE = "calpar.usuarios";

  function salvar(lista) {
    localStorage.setItem(
      CHAVE,
      JSON.stringify({ dados: lista, quando: new Date().toISOString() })
    );
  }

  function ler() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE));
    } catch {
      return null;
    }
  }

  return { salvar, ler };
})();
