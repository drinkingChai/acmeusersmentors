const conn = require('./_db');
const Award = require('./award');

const User = conn.define('user', {
	name: {
		type: conn.Sequelize.STRING,
		allowNull: false
	},
	isMentor: {
		type: conn.Sequelize.BOOLEAN,
		default: false,
		allowNull: false
	}
})

User.prototype.addAward = ()=> {
  return Award.createAward(this);
}

User.createUser = (name)=> {
  return this.create({ name: name })
}

User.promote = (id)=> {
  return User.findOne({ where: { id: id }}).then(user=> {
    Award.findAll({ where: { userId: id }}).then(awards=> {
      if (awards.length >= 2) user.isMentor = true;
    })
  })
};

User.deleteUser = (id)=> {
  return this.findOne({ where: { id: id }})
    .then(record=> { record.destroy(); })
}

module.exports = User;
