const expect = require('chai').expect;
const conn = require('../../models');
const User = conn.models.User;
const Award = conn.models.Award;

describe('User model', ()=> {
	/*
		- first step - creating and deleting users
		- second step - creating and deleting awards
		- third step - adding and removing mentors for a user
		- only a user with 2 or more awards can be a mentor
		- a user can not mentor themselves
		- a key part of this is removing a users mentees if their award count falls below 2.
	*/

	let allUsers, allAwards, bob, susan, lea,
		bobsAwards, susansAwards;
	beforeEach(()=> {
		return conn.sync()
			.then(()=> conn.seed())
			.then(()=> User.findAll({ order: ['id'] }))
			.then(users=> {
				allUsers = users;
				bob = allUsers.filter(user=> user.name == 'Bob')[0];
				susan = allUsers.filter(user=> user.name == 'Susan')[0];
				lea = allUsers.filter(user=> user.name =='Lea')[0];
				return Award.findAll({ order: ['id'] })
			}).then(awards=> {
				allAwards = awards;
				bobsAwards = awards.filter(award=> award.userId = bob.id);
				susansAwards = awards.filter(award=> award.userId = susan.id);
			})
	})


	it('User model exists', ()=> {
		return expect(User).to.be.ok;
	})


	describe('Create and delete users', ()=> {
		it('creates an user', ()=> {
			return User.create({ name: 'Harry' })
				.then(()=> User.findOne({ where: { name: 'Harry' }}))
				.then(user=> {
					expect(user.name).to.equal('Harry');
					expect(user.name).to.not.equal('Bob');
				})
		})

		it('lists all users', ()=> {
			return User.findAll().then(users=> {
				expect(users.length).to.equal(3);
				expect(users.length).to.not.equal(1);
			})
		})

		it('deletes an user', ()=> {
			return User.findOne({ where: { name: 'Bob' }})
				.then(user=> user.destroy())
				.then(()=> User.findAll())
				.then(users=> {
					let usernames = users.map(user=> user.name);
					expect(users.length).to.equal(2);
					expect(usernames).to.not.include('Bob');
				})
		})
	})


	describe('Create and delete awards', ()=> {
		it('creates an award', ()=> {
			return User.giveAward(bob.id)
				.then(()=> Award.getAwards(bob.id))
				.then(awards=> {
					expect(awards.length).to.equal(3);
					expect(awards.length).to.not.equal(1);
				});
		})

		it('lists all awards for a user', ()=> {
			return Award.getAwards(bob.id)
				.then(awards=> {
					expect(awards.length).to.equal(2);
				})
		})

		it('deletes an award', ()=> {
			return User.removeAward(bob.id, bobsAwards[0].id)
				.then(()=> Award.getAwards(bob.id))
				.then(awards=> {
					expect(awards.length).to.equal(1);
					expect(awards.length).to.not.equal(3);
				})
		})
	})


	describe('Add and remove mentors', ()=> {
		it('assign a mentor to a user', ()=> {
			return User.assignMentor(bob.id, susan.name)
				.then(()=> User.findOne({ where: { id: bob.id }}))
				.then(user=> {
					expect(user.mentorId).to.equal(susan.id);
					expect(user.mentorId).to.not.equal(lea.id);
				});
		})

		it('list all mentors', ()=> {
			return User.listMentors().then(mentors=> {
				expect(mentors.length).to.equal(2);
				expect(mentors.length).to.not.equal(3);
			})
		})

		it('removes a mentor to a user', ()=> {
			let userId = bob.id
			return User.assignMentor(userId, susan.name)
				.then(()=> User.findOne({ where: { id: userId }}))
				.then(user=> {
					expect(user.mentorId).to.be.ok;
					return User.removeMentor(userId)
				})
				.then(user=> {
					expect(user.mentorId).to.be.null;
				})
		})

		it("can't mentor themselves", ()=> {
			return User.assignMentor(bob.id, bob.name)
				.then(null, err=> {
					expect(err).to.be.an('error');
				})
		})
	})


	describe('Test business plan', ()=> {
		describe('User', ()=> {
			it('is a mentor', ()=> {
				return bob.isMentor()
					.then(user=> {
						expect(user).to.be.ok;
					})
			})

			it('remove mentor from user if mentor has less than 2 awards', ()=> {
				return Promise.all([
					User.assignMentor(bob.id, susan.name),
					User.assignMentor(lea.id, susan.name)
				]).then(()=> User.findOne({ where: { id: bob.id }}))
					.then(user=> {
						expect(user.mentorId).to.equal(susan.id);
					})
					.then(()=> User.removeAward(susan.id, susansAwards[0].id))
					.then(()=> User.findOne({ where: { id: bob.id }}))
					.then(user=> {
						expect(user.mentorId).to.be.null;
					})
					.then(()=> User.findOne({ where: { id: lea.id }}))
					.then(user=> {
						expect(user.mentorId).to.be.null;
					})
			})
		})
	})

})
