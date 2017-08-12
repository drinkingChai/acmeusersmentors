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

	let allUsers, allAwards;
	beforeEach(()=> {
		return conn.sync()
			.then(()=> conn.seed())
			.then(()=> User.findAll({ order: ['id'] }))
			.then(users=> {
				allUsers = users;
				return Award.findAll({ order: ['id'] })
			}).then(awards=> {
				allAwards = awards;
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
			return User.giveAward(allUsers[0].id)
				.then(()=> Award.getAwards(allUsers[0].id))
				.then(awards=> {
					expect(awards.length).to.equal(3);
					expect(awards.length).to.not.equal(1);
				});
		})

		it('lists all awards for a user', ()=> {
			return Award.getAwards(allUsers[0].id)
				.then(awards=> {
					expect(awards.length).to.equal(2);
				})
		})

		it('deletes an award', ()=> {
			let user = allUsers.filter(user=> user.name == 'Bob')[0],
				userAwards = allAwards.filter(award=>user.id == award.userId);

			return User.removeAward(user.id, userAwards[0].id)
				.then(()=> Award.getAwards(user.id))
				.then(awards=> {
					expect(awards.length).to.equal(1);
					expect(awards.length).to.not.equal(3);
				})
		})
	})


	describe('Add and remove mentors', ()=> {
		it('assign a mentor to a user', ()=> {
			return User.assignMentor(allUsers[0].id, allUsers[1].name)
				.then(()=> User.findOne({ where: { id: allUsers[0].id }}))
				.then(user=> {
					expect(user.mentorId).to.equal(allUsers[1].id);
					expect(user.mentorId).to.not.equal(allUsers[2].id);
				});
		})

		it('list all mentors', ()=> {
			return User.listMentors().then(mentors=> {
				expect(mentors.length).to.equal(2);
				expect(mentors.length).to.not.equal(3);
			})
		})

		it('removes a mentor to a user', ()=> {

		})

		it("can't mentor themselves", ()=> {

		})
	})


	describe('Test business plan', ()=> {
		describe('User', ()=> {
			it('is a mentor', ()=> {

			})

			it('remove mentor from user if mentor has less than 2 awards', ()=> {

			})
		})
	})

})
