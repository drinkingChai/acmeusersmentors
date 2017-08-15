const User = require('./user');

const seed = ()=> {
  return Promise.all([
    User.create({ name: 'Bob' }),
    User.create({ name: 'Mary' }),
    User.create({ name: 'Susan' })
  ]).then(users=> {
    bob = users[0];
    mary = users[1];
    susan = users[2];
    return Promise.all([
      User.generateAward(bob.id),
      User.generateAward(bob.id),
      User.generateAward(susan.id),
      User.updateUserFromRequestBody(mary.id, { mentor_id: bob.id }),
      User.updateUserFromRequestBody(susan.id, { mentor_id: bob.id })
    ])
  })
}

module.exports = seed;