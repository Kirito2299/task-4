require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');

const DB = require('./util/database');


const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

const app = express();

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log('Connected to DB'));

app.use(express.json());

app.post('/buyer/login', async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) res.status(400).send(error.details[0].message);
    const user = await DB.findOne({
        email: req.body.email
    });
    if (!user) return res.status(400).send('Enter Valid Email ID or Password');

    const passCheck = await bcrypt.compare(req.body.password, user.password);
    if (!passCheck) return res.status(400).send('Enter Valid Email ID or Password');

    const token = jwt.sign({
        id: user._id
    }, process.env.TOK_SECRET, {
        expiresIn: '1.5h'
    });
    res.header('token', token).send(token);
});

app.listen(3000, () => {
    console.log('Listening on port 3000'); 
});