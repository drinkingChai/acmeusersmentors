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

  let allUsers, bob, mary, susan;
  beforeEach(()=> {
    return conn.sync()
    .then(()=> conn.seed())
    .then(()=> User.findAll())
    .then(users=> {
      bob = users.find(user=> user.name == 'Bob');
      mary = users.find(user=> user.name == 'Mary');
      susan = users.find(user=> user.name == 'Susan');
    })
  })


  describe('create the view model', ()=> {
    beforeEach(()=> {
      return Promise.all([
        User.generateAward(bob.id),
        User.generateAward(bob.id),
        User.generateAward(susan.id),
        User.updateUserFromRequestBody(bob.id, { action: 'assign', id: mary.id }),
        User.updateUserFromRequestBody(bob.id, { action: 'assign', id: susan.id })
      ])
    })

    it('creates view with user, mentor, awards, and list of mentors', ()=> {
      return User.findUsersViewModel()
      .then(viewModel=> {
        let bobView = viewModel.users.find(user=> user.id == bob.id),
          maryView = viewModel.users.find(user=> user.id == mary.id),
          susanView = viewModel.users.find(user=> user.id == susan.id);

        expect(viewModel.users.length).to.equal(3);
        expect(bobView.awards.length).to.equal(2);
        expect(maryView.mentor.name).to.equal(bob.name);
        expect(susanView.mentor.name).to.equal(bob.name);
      })
    })
  })


  describe('Deletes a user', ()=> {
    it('deletes a user by id', ()=> {
      return User.destroyById(bob.id)
      .then(()=> User.findOne({ where: { id: bob.id }}))
      .then(user=> expect(user).to.be.null);
    })
  })


  describe('assign and remove mentor', ()=> {
    it('assigns a mentor', ()=> {
      return User.updateUserFromRequestBody(bob.id, { action: 'assign', id: mary.id })
      .then(()=> User.findOne({ where: { id: mary.id }}))
      .then(user=> expect(user.mentorId).to.equal(bob.id));
    })

    it('removes a mentor', ()=> {
      return User.updateUserFromRequestBody(null, { action: 'remove', id: mary.id })
      .then(()=> User.findOne({ where: { id: mary.id }}))
      .then(user=> expect(user.mentorId).to.be.null);
    })

    // cannot mentor themselves
    it('cant assign self as mentor', ()=> {
      expect(User.updateUserFromRequestBody(bob.id, { action: 'assign', id: bob.id })).to.be.an('error');
    })
  })


  describe('create and remove awards', ()=> {
    it('creates an award for a user', ()=> {
      return User.generateAward(bob.id)
      .then(()=> Award.findAll({ where: { userId: bob.id }}))
      .then(awards=> expect(awards.length).to.equal(1));
    })

    it('removes an award for a user', ()=> {
      return User.generateAward(bob.id)
      .then(award=> User.removeAward(bob.id, award.id))
      .then(()=> Award.findAll({ where: { userId: bob.id }}))
      .then(awards=> expect(awards.length).to.equal(0));
    })
  })


  describe('remove user as mentor if award < 2', ()=> {

    let award1;
    beforeEach(()=> {
      return Promise.all([
        User.generateAward(bob.id),
        User.generateAward(bob.id),
        User.updateUserFromRequestBody(bob.id, { action: 'assign', id: mary.id }),
        User.updateUserFromRequestBody(bob.id, { action: 'assign', id: susan.id })
      ]).then(awards=> {
        award1 = awards[0];
      })
    })

    it('remove user as mentor if award < 2', ()=> {
      return User.removeAward(bob.id, award1.id)
      .then(()=> User.findAll({ where: { id: { $ne: bob.id }}}))
      .then(users=> {
        users.forEach(user=> {
          expect(user.mentorId).to.be.null;
        })
      })
    })
  })


})
