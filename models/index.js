const conn = require('./_db');
const User = require('./user');
const Award = require('./award');


Award.belongsTo(User);
User.hasMany(Award);

User.belongsTo(User, { as: 'mentor' });
User.hasMany(User, { as: 'mentees', foreignKey: 'mentorId' });


const seed = ()=> {
  return Promise.all([
    User.create({ name: 'Bob' }),
    User.create({ name: 'Mary' }),
    User.create({ name: 'Susan' })
  ]).then(users=> {
    bob = users[0];
    mary = users[1];
    susan = users[2];
    User.generateAward(bob.id),
    User.generateAward(bob.id),
    User.generateAward(susan.id),
    User.updateUserFromRequestBody(mary.id, { mentor_id: bob.id }),
    User.updateUserFromRequestBody(susan.id, { mentor_id: bob.id })
  })
}


const sync = ()=> {
  return conn.sync({ force: true });
}


module.exports = {
  sync,
  seed,
  models: {
    User,
    Award
  }
};
