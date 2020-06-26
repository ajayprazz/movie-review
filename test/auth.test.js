process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require("../server");

const should = chai.should();

chai.use(chaiHttp)

const db = require("./../models/");

describe('Auth Test', () => {

    let token = "";

    before(async () => {
        await db.sequelize.sync({
            force: true
        })

        await db.User.create({
            email: 'test@gmail.com',
            username: 'test',
            password: 'test',
            role: 1
        });
    });

    describe('POST /auth login', () => {
        it('It should login the user', (done) => {
            chai.request(app)
                .post('/auth/login')
                .send({
                    username: 'test',
                    password: 'test',
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    done();
                })
        });
    });
});