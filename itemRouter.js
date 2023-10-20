const express = require('express');
const router = new express.Router();
let items = require('./fakeDb');
const expError = require('./expError');

router.get('/', (req,res) =>{
    res.status(200);
    return res.json(items);
});

router.post('/', (req,res,next)=>{
    let itemName;
    let price;
    try{
        itemName = req.body.name;
        price = req.body.price;
        if(!itemName){
            throw new expError('Name is undefined',400);
        }if(!price){
            throw new expError('Price is undefined',400);
        };
    }catch(e){
        return next(e);
    };
    let newItem = {name : itemName, price : price};
    items.push(newItem);
    res.status(200);
    return res.json({added: newItem})
});

router.get('/:name', (req,res,next)=>{
    let foundItem;
    try{
        foundItem = items.find((item) => item.name == req.params.name);
        if (!foundItem){
            throw new expError(`${req.params.name} could not be found!`,404);
        };
    }catch(e){
        return next(e);
    };
    return res.json(foundItem);
});

router.patch('/:name', (req,res,next)=>{
    let foundItem;
    let newName;
    let newPrice;
    try{
        newName = req.body.name;
        newPrice = req.body.price;
        foundItem = items.find((item) => item.name == req.params.name);
        if(!newName){
            throw new expError('Name is undefined',400);
        }if(!newPrice){
            throw new expError('Price is undefined',400);
        }if(!foundItem){
            throw new expError(`${req.params.name} could not be found!`,404);
        };
    }catch(e){return next(e);}
    foundItem.name = newName;
    foundItem.price = newPrice;
    return res.json({updated : foundItem});
});

router.delete('/:name', (req,res,next) =>{
    let foundItem;
    try{
        foundItem = items.find((item) => item.name == req.params.name);
        if (!foundItem){
            throw new expError(`${req.params.name} could not be found!`,404);
        };
    }catch(e){
        return next(e);
    };
    try{
        let newItems = items.filter((item) => item.name !== foundItem.name);
        items = newItems;
    }catch(e){
        console.log(e);
        return next(e);
    };
    return res.json({message : 'Deleted'});
});


module.exports = router;