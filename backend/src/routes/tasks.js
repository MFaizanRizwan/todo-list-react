import express from 'express';

const taskController = require('../controllers/taskController');

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Tasks route is working!');
});

router.post('/add', taskController.create);
router.get('/all', taskController.getTasks);
router.get('/user/:username', taskController.getTasksByUser);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;