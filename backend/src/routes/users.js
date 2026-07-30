import express from 'express';
import { getUsers } from '../services/user_services/getUsers';
import { getUsersCount } from '../services/user_services/getUsersCount';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
 
router.get('/', (req, res) => {
    res.send('Users route is working!');
});

router.get('/all', userController.getUsers);
router.get('/count', userController.getUsersCount);

module.exports = router;