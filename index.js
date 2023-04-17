const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors') ;
//const MongoStore = requie('connect-mongo')(session);

//const MongoDBStore = require('connect-mongo');

connectToMongo();
const app = express()
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());

app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));


app.get('/', (req, res) => {
  res.send('Hello World Changed!')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})