
exports.up = knex => knex.schema.createTable("notes", table => {
    table.increments("id");
    table.text("title");
    table.text("description");
    table.integer("rating");
    table.integer("user_id").references("id").inTable("users");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
})

exports.down = knex => knex.schema.dropTable("notes");

knex('users').where({ id: 5 }).first()
  .then(user => {
    if (user) {
      // Inserir na tabela "notes" porque o usuário existe
      return knex('notes').insert({
        title: 'Filme 1',
        description: 'Descrição do filme',
        rating: 8,
        user_id: 5
      });
    } else {
      // Tratar o caso onde o usuário não existe
      throw new Error('Usuário não encontrado');
    }
  })
  .then(() => {
    console.log('Nota inserida com sucesso');
  })
  .catch(error => {
    console.error('Erro ao inserir nota:', error);
  });
