process.env.NODE_ENV = 'test';

const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const should = chai.should();

const app = require("../server");

const db = require("./../models/");

describe('Review Test', () => {
    let token = '';
    let user, movie, review = {};
    before(async () => {
        await db.sequelize.sync({
            force: true
        });

        user = await db.User.create({
            email: 'test@gmail.com',
            username: 'test',
            password: 'test',
            role: 1
        });
    });

    describe('POST /auth/login', () => {
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
                    user = res.body.user;
                    token = res.body.token;
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('Post /movie', () => {
        it('It should add new movie', done => {
            chai.request(app)
                .post('/movie')
                .set('authorization', token)
                .type('form')
                .field('title', 'test_movie')
                .field('duration', 100000)
                .field('releasedDate', new Date().toISOString().split('T')[0])
                .attach('poster', __dirname + '/../uploads/test/test_poster.jpg')
                .then(res => {
                    // console.log(res);
                    res.should.have.status(200);
                    res.body.should.have.property('movie');
                    movie = res.body.movie;
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('POST /review', () => {
        it('it should add new review', done => {
            chai.request(app)
                .post('/review')
                .set('authorization', token)
                .type('form')
                .send({
                    'userId': user.id,
                    'movieId': movie.id,
                    'rating': 9,
                    'review': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                })
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property('review');
                    review = res.body.review;
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('GET /review/:id', () => {
        it('it should get review with given id', done => {
            chai.request(app)
                .get(`/review/${review.id}`)
                .set('authorization', token)
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property('review');
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('PUT /review/:id', () => {
        it('it should update review of given id', done => {
            chai.request(app)
                .put(`/review/${review.id}`)
                .set('authorization', token)
                .type('form')
                .field('rating', 8)
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property('review');
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('DELETE /review/:id', () => {
        it('it should delete review of given id', done => {
            chai.request(app)
                .delete(`/review/${review.id}`)
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