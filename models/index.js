const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL);


const User = conn.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	isMentor: {
		type: Sequelize.BOOLEAN,
		default: false,
		allowNull: false
	},
	awards: {
		type: Sequelize.ARRAY(Sequelize.INTEGER),
		default: []
	}
})

User.prototype.addAward = function(phrase) {
	this.setDataValue('awards', this.getDataValue('awards').push(phrase));
};

User.prototype.promote = function() {
	if (this.getDataValue('awards').length >= 2) {
		this.setDataValue('isMentor', true);
	} else throw new Error('Not enough awards');
}

const Award = conn.define('award', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	}
})


const sync = ()=> {
	return conn.sync({ force: true });
}



module.exports = {
	sync,
	models: {
		User,
		Award
	}
};