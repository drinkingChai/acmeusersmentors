const expect = require('chai').expect;

describe('User model', ()=> {

	/*
		- first step - creating and deleting users 
		- second step - creating and deleting awards 
		- third step - adding and removing mentors for a user
		- only a user with 2 or more awards can be a mentor
		- a user can not mentor themselves
		- a key part of this is removing a users mentees if their award count falls below 2.
	*/

	describe('Create and delete users', ()=> {
		it('Creates an user', ()=> {

		})

		it('Delets an user', ()=> {

		})
	})


	describe('Create and delete awards', ()=> {
		it('Creates an award', ()=> {

		})

		it('Delets an award', ()=> {

		})
	})


	describe('Add and remove mentors', ()=> {
		it('Adds a mentor to a user', ()=> {

		})

		it('Adds multiple mentors to a user', ()=> {

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