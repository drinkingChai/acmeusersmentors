const expect = require('chai').expect;
const User = require('../../models').User;

describe('User model', ()=> {
	/*
		- first step - creating and deleting users 
		- second step - creating and deleting awards 
		- third step - adding and removing mentors for a user
		- only a user with 2 or more awards can be a mentor
		- a user can not mentor themselves
		- a key part of this is removing a users mentees if their award count falls below 2.
	*/

	beforeEach(()=> {
		let allUsers;
		return User.sync()
						.then(()=> User.seed())
						.then(data => {

						})
	})


	describe('User model exists', ()=> {
		it('Expects the model to exist', ()=> {
			expect(User).to.be.ok();
		})
	})


	describe('Create and delete users', ()=> {
		it('Creates an user', ()=> {
			// User.createNewUser('Harry')
			// 	.then(user=> {
			// 		expect(user.name).to.be('Harry');
			// 	})
		})

		it('Lists all users', ()=> {
			
		})

		it('Delets an user', ()=> {

		})
	})


	describe('Create and delete awards', ()=> {
		it('Creates an award', ()=> {

		})

		it('Lists all awards for a user', ()=> {

		})

		it('Deletes an award', ()=> {

		})
	})


	describe('Add and remove mentors', ()=> {
		it('Adds a mentor to a user', ()=> {

		})

		it('Adds multiple mentors to a user', ()=> {

		})

		it('List all mentors', ()=> {

		})

		it('List all mentors for a user', ()=> {

		})

		it('Removes a mentor to a user', ()=> {

		})

		it("Can't mentor themselves", ()=> {

		})
	})


	describe('Test business plan', ()=> {
		describe('Promote and demote a user', ()=> {
			it('Promote a user', ()=> {
				
			})

			it('Demote a user', ()=> {

			})

			it('Demotes if the user has less than 2 awards', ()=> {

			})
		})
	})

})