process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require("../server");

const should = chai.should();

chai.use(chaiHttp)

const db = require('./../models');

describe("Movie Test", () => {

    let token = "";
    let movie = {};
    let user = {};
    let genre = {};

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

    describe('POST /genre', () => {
        it('it should add new genre', done => {
            chai.request(app)
                .post('/genre')
                .set('authorization', token)
                .send({
                    name: 'test_genre'
                })
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property('genre');
                    genre = res.body.genre;
                    done();
                })
                .catch(err => {
                    throw err;
                })
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
                .field('genre', genre.id)
                .attach('poster', __dirname + '/../uploads/test/test_poster.jpg')
                .then(res => {
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
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('GET /movie', () => {
        it('it should return list of all movies', done => {
            chai.request(app)
                .get('/movie')
                .set('authorization', token)
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property('movies');
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('GET /movie/:id', () => {
        it('it should return movie of given id', done => {
            chai.request(app)
                .get(`/movie/${movie.id}`)
                .set('authorization', token)
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property('movie');
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('PUT /movie/:id', () => {
        it('it should update movie with given id', done => {
            chai.request(app)
                .put(`/movie/${movie.id}`)
                .set('authorization', token)
                .type('form')
                .field('title', 'test_movie_1')
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property('movie');
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('GET /movie/:id/review', () => {
        it('it should return reviews of movie with given id', done => {
            chai.request(app)
                .get(`/movie/${movie.id}/review`)
                .set('authorization', token)
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property('reviews');
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('GET /movie/:id/genre', () => {
        it('it should return genres of movie with given id', done => {
            chai.request(app)
                .get(`/movie/${movie.id}/genre`)
                .set('authorization', token)
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property('genres');
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('DELETE /movie/:id', () => {
        it('it should delete movie with given id', done => {
            chai.request(app)
                .delete(`/movie/${movie.id}`)
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