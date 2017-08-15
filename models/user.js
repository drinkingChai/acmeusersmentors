const conn = require('./_db');
const Award = require('./award');

const User = conn.define('user', {
  name: {
    type: conn.Sequelize.STRING,
    allowNull: false,
    set(val) {
      return this.setDataValue('name', val.trim().length > 0 ? val.trim() : null);
    },
    get() {
      return this.getDataValue('name');
    }
  }
})

User.findUsersViewModel = ()=> {
  let users, mentors = [];
  return User.findAll({
    include: [
      { model: User, as: 'mentor' },
      { model: Award }
    ], order: [ 'mentorId' ]
  }).then(users=> {
    users = users;
    users.forEach(user=> {
      if (user.awards.length >= 2) mentors.push(user);
    })
    users.forEach(user=> {
      if (!user.mentor) user.beMentored = mentors.filter(m=> m.id != user.id);
    })
    return { users };
  })
}

User.destroyById = (id)=> {
  return User.findOne({ where: { id: id }})
  .then(user=> user.destroy());
}

User.updateUserFromRequestBody = (id, data)=> {
  // assign and remove mentor
  if (data.mentor_id) {
    if (id == data.mentor_id) return new Error('Cant assign mentor to onself');
    return User.findOne({ where: { id: data.mentor_id }})
    .then(mentor=> {
      return User.findOne({ where: { id: id }})
      .then(mentee=> {
        return mentee.setMentor(mentor);
      })
    })
  } else {
    return User.findOne({ where: { id: id }})
    .then(user=> user.setMentor(null));
  }
}

User.generateAward = (id)=> {
  return User.findOne({ where: { id: id }})
  .then(user=> Award.makeOne(user));
}

User.removeAward = (id, awardId)=> {
  return Award.findOne({ where: { id: awardId }})
  .then(award=> award.destroy())
  .then(()=> Award.findAll({ where: { userId: id }}))
  .then(awards=> {
    if (awards.length < 2) {
      return User.findAll({ where: { mentorId: id }})
    }
  }).then(mentees=> {
    if (mentees) {
      return Promise.all(mentees.map(mentee=> mentee.setMentor(null)));
    }
  })
}

module.exports = User;
