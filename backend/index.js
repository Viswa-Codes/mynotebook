const connectToMongo = require('./db');
const express = require('express')

connectToMongo();

const app = express()
const port = 5000

//Middleware to use req.body or anyincoming json data
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port at http://localhost:${port}`)
})
