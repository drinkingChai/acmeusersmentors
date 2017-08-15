const conn = require('./_db');
const User = require('./user');
const Award = require('./award');
const seed = require('./seed');


Award.belongsTo(User);
User.hasMany(Award);

User.belongsTo(User, { as: 'mentor' });
User.hasMany(User, { as: 'mentees', foreignKey: 'mentorId' });


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
