const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require("../server");

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp)

const User = require('./../models').User;

describe("User Test", () => {

    let token = "";

    before(async () => {
        await User.create({
            email: 'test@gmail.com',
            username: 'test',
            password: 'test',
        });
    });

    after(async () => {
        await User.destroy({
            where: {
                email: 'test@gmail.com'
            }
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
                    done();
                })
                .catch(err => {
                    throw err;
                })
        });
    });

    describe('/GET user', () => {
        it('it should Get all users', (done) => {
            chai.request(app)
                .get('/user')
                .set('Authorization', token)
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
                .catch(err => {
                    throw err;
                })
        });
    });
});