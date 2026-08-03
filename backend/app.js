import express from 'express';
import usersRouter from './src/routes/users.js';
import productsRouter from './src/routes/tasks.js';

const app = express();
const port = 3002;

// Use the routers
app.use('/users', usersRouter);
app.use('/tasks', productsRouter);

app.get('/', (req, res) => {
    res.send('Main application home page');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});