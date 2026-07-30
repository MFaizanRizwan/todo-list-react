import UserModel from '../models/userModel';

exports.getUsers = async (req, res) => {
    try {
        const users = await UserModel.getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).send('Error retrieving users');
    }
};

exports.getUsersCount = async (req, res) => {
    try {
        const count = await UserModel.getUsersCount();
        res.json({ count });
    } catch (error) {
        res.status(500).send('Error retrieving user count');
    }
};