const jwt = require('jsonwebtoken');

module.exports =  function verify (req, res, next){
    const token = req.header('token');
    if(!token) return res.status(401).send('Token expired');

    try{
        const verified = jwt.verify(token, process.env.SECRET);
    }
    catch{

    }
}