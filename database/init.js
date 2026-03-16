const bcrypt = require('bcrypt');
const db = require('./db');

db.serialize(async () => {
  db.run(`
    create table if not exists usuarios (
      id integer primary key autoincrement,
      nome text not null,
      email text not null unique,
      senha text not null,
      permissoes text not null
    )
  `);

  const senhaHash = await bcrypt.hash('123456', 10);

  db.get('select * from usuarios where email = ?', ['admin@petagenda.com'], (err, row) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err.message);
      return;
    }

    if (!row) {
      db.run(
        'insert into usuarios (nome, email, senha, permissoes) values (?, ?, ?, ?)',
        ['Administrador', 'admin@petagenda.com', senhaHash, 'administrador'],
        (insertErr) => {
          if (insertErr) {
            console.error('Erro ao inserir usuário inicial:', insertErr.message);
          } else {
            console.log('Usuário inicial criado com sucesso.');
          }
        }
      );
    } else {
      console.log('Usuário inicial já existe.');
    }
  });
});