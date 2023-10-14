const express = require('express');
const expError = require('./expError');
const app = express();
const itemRouter = require('./itemRouter');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.json());
app.use('/items',itemRouter);

app.use((req,res,next) =>{
    const e = new expError('page not found',404);
    return next(e);
});
app.use((error,req,res,next)=>{
    return res.status(error.status).json({message : error.message, status : error.status});
});

module.exports = app;