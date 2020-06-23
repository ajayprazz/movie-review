const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require("../server");

const should = chai.should();

chai.use(chaiHttp)

const User = require('./../models').User;

describe('Auth Test', () => {

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
                email: "test@gmail.com"
            }
        });
    })

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