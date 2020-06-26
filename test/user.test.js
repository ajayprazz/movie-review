process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require("../server");

const should = chai.should();

chai.use(chaiHttp)

const db = require('./../models');

describe("User Test", () => {

    let token, user = "";

    before(async () => {
        await db.sequelize.sync({
            force: true
        });

        await db.User.create({
            email: 'test@gmail.com',
            username: 'test',
            password: 'test',
            role: 1
        });
    });

    describe('POST /auth login', () => {
        it('It should auth login the', (done) => {
            chai.request(app)
                .post('/auth/login')
                .send({
                    username: 'test',
                    password: 'test',
                })
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('token');
                    token = res.body.token;
                    user = res.body.user;
                    done();
                })
                .catch(err => {
                    throw err;
                })
        });
    });

    describe('GET /user', () => {
        it('it should return all users list', done => {
            chai.request(app)
                .get('/user')
                .set('authorization', token)
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property('users');
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });


    describe('GET /user/:id', () => {
        it('it should return user of given id', done => {
            chai.request(app)
                .get(`/user/${user.id}`)
                .set('authorization', token)
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property('user');
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('DELETE /user/:id', () => {
        it('it should delete user of given id', done => {
            chai.request(app)
                .delete(`/user/${user.id}`)
                .set('authorization', token)
                .then(res => {
                    res.should.have.status(200);
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });
});