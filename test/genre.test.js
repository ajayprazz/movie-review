process.env.NODE_ENV = 'test';

const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const should = chai.should;

const app = require("../server");

const db = require("./../models/");

describe('Genre test', () => {
    let user = {};
    let movie = {};
    let genre = {};
    let token = "";
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

    describe('GET /genre', () => {
        it('it should return list of genres', done => {
            chai.request(app)
                .get('/genre')
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

    describe('GET /genre/:id', () => {
        it('it should return genre with given id', done => {
            chai.request(app)
                .get(`/genre/${genre.id}`)
                .set('authorization', token)
                .then(res => {
                    res.should.have.status(200);
                    res.body.should.have.property('genre');
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('GET /genre/:id/movie', () => {
        it('it should return movie of given genre id', done => {
            chai.request(app)
                .get(`/genre/${genre.id}/movie`)
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

    describe('DELETE /genre/:id', () => {
        it('it should delete genre of given id', done => {
            chai.request(app)
                .delete(`/genre/${genre.id}`)
                .set('authorization', token)
                .then(res => {
                    res.should.has.status(200);
                    done();
                })
                .catch(err => {
                    throw err;
                });
        });
    });
});