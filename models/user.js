const conn = require('./_db');
const Award = require('./award');

const User = conn.define('user', {
	name: {
		type: conn.Sequelize.STRING,
		allowNull: false
	}
})

User.prototype.isMentor = function () {
	return Award.getAwards(this.id)
		.then(awards=> {
			return awards.length >= 2 ? this : false;
		})
};

User.giveAward = id=> {
	return User.findOne({ where: { id: id }}).then(user=> Award.createAward(user));
}

User.removeAward = (userId, awardId)=> {
	return Award.deleteAward(awardId).then(awards=> {
		if (awards.length < 2) {
			return User.findAll({
				where: { mentorId: userId },
			});
		}
	}).then(mentees=> {
		if (mentees && mentees.length) {
			return Promise.all(mentees.map(mentee=> mentee.setMentor(null)))
		}
	})
}

User.assignMentor = (menteeId, mentorName)=> {
	return User.findOne({ where: { id: menteeId }}).then(mentee=> {
		return User.findOne({ where: { name: mentorName }}).then(mentor=> {
			if (mentor.id == mentee.id) throw new Error('Cannot mentor themselves');
			return mentee.setMentor(mentor);
		})
	})
}

User.removeMentor = id=> {
	return User.findOne({ where: { id: id }})
		.then(user=> user.setMentor(null))
}

User.listMentors = ()=> {
	return User.findAll()
		.then(users=> Promise.all(users.map(user=> user.isMentor())))
		.then(mentors=> {
			return mentors.filter(mentor=> mentor);
		})
}


module.exports = User;
