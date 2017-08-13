const expect = require('chai').expect;
const conn = require('../../models');
const User = conn.models.User;
const Award = conn.models.Award;


describe('Test user model', ()=> {

  /*
		- first step - creating and deleting users
		- second step - creating and deleting awards
		- third step - adding and removing mentors for a user
		- only a user with 2 or more awards can be a mentor
		- a user can not mentor themselves
		- a key part of this is removing a users mentees if their award count falls below 2.
	*/

  let allUsers, tom, dick, harry;
  beforeEach(()=> {
    return conn.sync()
    .then(()=> conn.seed())
    .then(()=> User.findAll())
    .then(users=> {
      tom = users.find(user=> user.name == 'Tom');
      dick = users.find(user=> user.name == 'Dick');
      harry = users.find(user=> user.name == 'Harry');
    })
  })


  describe('create the view model', ()=> {
    it('create view with user, mentor, awards, and list of mentors', ()=> {

    })
  })


  describe('Deletes a user', ()=> {
    it('deletes a user by id', ()=> {
      return User.destroyById(tom.id)
      .then(()=> User.findOne({ where: { id: tom.id }}))
      .then(user=> expect(user).to.be.null);
    })
  })


  describe('assign and remove mentor', ()=> {
    it('assigns a mentor', ()=> {
      return User.updateUserFromRequestBody(tom.id, { action: 'assign', id: dick.id })
      .then(()=> User.findOne({ where: { id: dick.id }}))
      .then(user=> expect(user.mentorId).to.equal(tom.id));
    })

    it('removes a mentor', ()=> {
      return User.updateUserFromRequestBody(null, { action: 'remove', id: dick.id })
      .then(()=> User.findOne({ where: { id: dick.id }}))
      .then(user=> expect(user.mentorId).to.be.null);
    })

    // cannot mentor themselves
    it('cant assign self as mentor', ()=> {
      expect(User.updateUserFromRequestBody(tom.id, { action: 'assign', id: tom.id })).to.be.an('error');
    })
  })


  describe('create and remove awards', ()=> {
    it('creates an award for a user', ()=> {
      return User.generateAward(tom.id)
      .then(()=> Award.findAll({ where: { userId: tom.id }}))
      .then(awards=> expect(awards.length).to.equal(1));
    })

    it('removes an award for a user', ()=> {
      return User.generateAward(tom.id)
      .then(award=> User.removeAward(tom.id, award.id))
      .then(()=> Award.findAll({ where: { userId: tom.id }}))
      .then(awards=> expect(awards.length).to.equal(0));
    })
  })


  describe('remove user as mentor if award < 2', ()=> {

    let award1;
    beforeEach(()=> {
      return Promise.all([
        User.generateAward(tom.id),
        User.generateAward(tom.id),
        User.updateUserFromRequestBody(tom.id, { action: 'assign', id: dick.id }),
        User.updateUserFromRequestBody(tom.id, { action: 'assign', id: harry.id })
      ]).then(awards=> {
        award1 = awards[0];
      })
    })

    it('remove user as mentor if award < 2', ()=> {
      return User.removeAward(tom.id, award1.id)
      .then(()=> User.findAll({ where: { id: { $ne: tom.id }}}))
      .then(users=> {
        users.forEach(user=> {
          expect(user.mentorId).to.be.null;
        })
      })
    })
  })


})
