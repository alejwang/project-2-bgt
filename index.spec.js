/**
 * @jest-environment node
 */

const request = require('supertest');
const app = require('./index');

describe("Test todos methods", () => {
    it(`Returns all todos`, async done => {
        await request(app).get('/todo').expect(200).then((response) => {
            expect(response.body.length).toBe(3);
        });
        done();
    });
    it(`Returns a todo with id:${2}`, async done => {
        await request(app).get('/todo/2').expect(200).then((response) => {
            expect(response.body.name).toBe("Get pizza for dinner");
        });
        done();
    });
});

describe("Test repsonses from querying an external API", () => {
    it(`Should retrieve a random Chunk Norris joke`, async done => {
       let jokeResp = await request(app).get('/joke');
       let joke = JSON.parse(jokeResp.text);
       expect(joke.value).toBeTruthy(); 
       done();
    });
    it(`No 2 chunck Norris jokes will be the same`, async done => {
        let jokeResp1 = await request(app).get('/joke');
        let jokeResp2 = await request(app).get('/joke');
        let joke1 = JSON.parse(jokeResp1.text);
        let joke2 = JSON.parse(jokeResp2.text);
        expect(joke1.value === joke2.value).toBeFalsy();
        done();
    });
});