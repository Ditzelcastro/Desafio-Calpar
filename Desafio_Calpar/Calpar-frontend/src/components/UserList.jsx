function UserList({ usuarios }) {
  if (!usuarios.length) {
    return <p className="dica">Nenhum usuário para exibir.</p>;
  }

  return (
    <div className="grade">
      {usuarios.map((usuario, indice) => (
        <UserCard key={indice} usuario={usuario} />
      ))}
    </div>
  );
}
