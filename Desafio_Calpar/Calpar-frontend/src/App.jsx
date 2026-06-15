function App() {
  const { useState, useEffect } = React;

  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");
  const [info, setInfo] = useState("");
  const [carregando, setCarregando] = useState(true);

  function formatar(iso) {
    try {
      return new Date(iso).toLocaleString("pt-BR");
    } catch {
      return iso;
    }
  }

  async function carregar() {
    setErro("");
    setCarregando(true);
    try {
      const lista = await Calpar.api.buscarUsuarios();
      setUsuarios(lista);
      Calpar.storage.salvar(lista);
      setInfo("Atualizado em " + formatar(new Date().toISOString()));
    } catch (e) {
      setErro(e.message);
      const cache = Calpar.storage.ler();
      if (cache && Array.isArray(cache.dados) && cache.dados.length) {
        setUsuarios(cache.dados);
        setInfo("Exibindo dados salvos de " + formatar(cache.quando));
      } else {
        setUsuarios([]);
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <React.Fragment>
      <header className="topo">
        <h1>Usuários Calpar</h1>
        <p className="sub">Lista consumida da API, com status de disponibilidade</p>
      </header>

      <main className="container">
        {erro && <div className="erro">⚠️ {erro}</div>}

        <div className="acoes">
          <span className="dica">{info}</span>
          <button className="btn" onClick={carregar}>
            ↻ Recarregar
          </button>
        </div>

        {carregando ? (
          <p className="dica">Carregando usuários...</p>
        ) : (
          <UserList usuarios={usuarios} />
        )}
      </main>
    </React.Fragment>
  );
}
