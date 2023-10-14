process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('./app');
let items = require('./fakeDb');

let testItem = {name : 'test', price : 1.99};

beforeEach(()=>{
    items.push(testItem);
});
afterEach(()=>{
    items.length = 0;
});

describe('Test connection',()=>{
    test('Test connection by looking for a 404 page',async ()=>{
        let res = await request(app).get('/')
        expect(res).not.toBeNull();
        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual('page not found');
    });
});

describe('Test items GET route',()=>{
    test('Test that it can get the list of objects',async ()=>{
        let res = await request(app).get('/items');
        expect(res).not.toBeNull();
        expect(res.body.length).toEqual(1);
        expect(res.body[0].name).toEqual('test');
        expect(res.body[0].price).toEqual(1.99);
    });
    test('Test it can get a specified object', async ()=>{
        let res = await request(app).get('/items/test');
        expect(res).not.toBeNull();
        expect(res.body.name).toEqual('test');
        expect(res.body.price).toEqual(1.99);
    });
    test('Test it throws a 404 if the item is not found', async ()=>{
        let res = await request(app).get('/items/asdf');
        expect(res).not.toBeNull();
        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual('asdf could not be found!');
    });
});

describe('Test items POST route',()=>{
    test('Test that a new item can be posted', async ()=>{
        let res = await request(app).post('/items').send({
            name : 'test2',
            price : 2.99
        });
        expect(res).not.toBeNull();
        expect(res.body['added'].name).toEqual('test2');
        expect(res.body['added'].price).toEqual(2.99);

        let resCheck = await request(app).get('/items');
        expect(resCheck.body.length).toEqual(2);
    });
    test('Test an error is returned if name is undefined', async ()=>{
        let res = await request(app).post('/items').send({
            name : undefined,
            price : 2.99
        });
        expect(res).not.toBeNull();
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual('Name is undefined');
    });
    test('Test an error is returned if price is undefined', async ()=>{
        let res = await request(app).post('/items').send({
            name : 'test2',
            price : undefined
        });
        expect(res).not.toBeNull();
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual('Price is undefined');
    });
});

describe('Test items PATCH route',()=>{
    test('Test that it can patch an item', async () =>{
        let res = await request(app).patch('/items/test').send({
            name : 'test_updated',
            price : 5.00
        });
        expect(res).not.toBeNull();
        expect(res.body['updated'].name).toEqual('test_updated');
        expect(res.body['updated'].price).toEqual(5.00);

        let resTwo = await request(app).get('/items/test_updated');
        expect(resTwo).not.toBeNull();
        expect(resTwo.body.name).toEqual('test_updated');
        expect(resTwo.body.price).toEqual(5.00);
    });
    test('Test it throws an error for an invalid item', async () =>{
        let res = await request(app).patch('/items/asdf').send({
            name : 'test_updated',
            price : 5.00
        });
        expect(res).not.toBeNull();
        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual('asdf could not be found!');
    });
    test('Test it throws an error for undefined name',async ()=>{
        let res = await request(app).patch('/items/test').send({
            name : undefined,
            price : 5.00
        });
        expect(res).not.toBeNull();
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual('Name is undefined');
    });
    test('Test it throws an error for undefined price',async ()=>{
        let res = await request(app).patch('/items/test').send({
            name : 'test_updated',
            price : undefined
        });
        expect(res).not.toBeNull();
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual('Price is undefined');
    });
});

describe('Tests for DELETE route', ()=>{
    test('Test it can delete an item', async ()=>{
        let res = await request(app).delete('/items/test');
        expect(res).not.toBeNull();
        expect(res.body.message).toEqual('Deleted');

        let resTwo = await request(app).get('/items');
        expect(resTwo).not.toBeNull();
        expect(resTwo.body.length).toEqual(0);
    });
    test('Test it throws a 404 if the item is not found', async ()=>{
        let res = await request(app).delete('/items/asdf');
        expect(res).not.toBeNull();
        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual('asdf could not be found!');
    });
});

