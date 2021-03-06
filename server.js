const express = require('express');
const bodyParser = require('body-parser')
const cor = require('cors')
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
  });
  

const app = express();

app.use(bodyParser.json());
app.use(cor())

app.get('/', (req, res) => {
    res.status(200).send('connet with heroku')
})

app.post('/signin', (req, res) => {
    console.log('======hit signin=====')
    const {email, password} = req.body;

    db('users').where({email: email}).select('password')
    .then(data => {
        if(password === data[0].password ){
            return db.select('*').from('users').then(data => res.json(data));
        } else {
            return res.status(400).json('username not found')
        }
    })
    .catch(err => res.status(400).json([]))
})

app.post('/register', (req, res) => {
    console.log('=====someone has been regist=======')

    const {firstname, lastname, email, password, description} = req.body;
    db('users')
    .returning('*')
    .insert({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        description: description
    })
    .then(data => {
        res.json(data[0])
    })
})

app.delete('/main', (req, res) => {
    console.log('======someone try to delete=======')

    db('users').where('email', req.body.target)
    .del()
    .then(() =>  {
        return db.select('*').from('users').then(data => res.json(data));
    })
    .catch(err => res.status(400).json('error'))

   
})


app.listen(process.env.PORT || 3000, () => {
    console.log(`server is running on ${process.env.PORT}`)
})