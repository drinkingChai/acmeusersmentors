const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL);


const Page = conn.define('page', {

})


const sync = ()=> {
	return conn.sync({ force: true });
}



module.exports = {
	sync,
	models: {
		Page
	}
};