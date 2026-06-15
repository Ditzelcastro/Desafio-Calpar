function UserCard({ usuario }) {
  return (
    <div className="card-user">
      <div className="nome">{usuario.nome}</div>
      <span className={"badge " + (usuario.disponivel ? "sim" : "nao")}>
        {usuario.disponivel ? "Disponível" : "Indisponível"}
      </span>
    </div>
  );
}
