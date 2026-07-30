import { getUsers } from '../services/user_services/getUsers';
import { getUsersCount } from '../services/user_services/getUsersCount';
import { createUser } from '../services/user_services/createUser';
import { signInUser } from '../services/user_services/signinUser';

class UserModel {
    async getUsers() {
        try {
            const users = await getUsers();
            return users;
        } catch (error) {
            throw new Error('Error retrieving users');
        }
    }

    async getUsersCount() {
        try {
            const count = await getUsersCount();
            return count;
        } catch (error) {
            throw new Error('Error retrieving user count');
        }
    }
}

module.exports = new UserModel();