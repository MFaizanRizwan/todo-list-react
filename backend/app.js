const express = require('express');
const usersRouter = require('./src/routes/users');
const productsRouter = require('./src/routes/tasks');

const app = express();
const port = 65532;

// Use the routers
app.use('/users', usersRouter);
app.use('/tasks', productsRouter);

app.get('/', (req, res) => {
  res.send('Main application home page');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});