const Sequelize = require("sequelize");

const sequelize = new Sequelize("movie-review", "root", "", {
    host: "localhost",
    dialect: "mysql",
});


let db = {};

sequelize
    .authenticate()
    .then(() => {
        console.log("database connection successfull");
    })
    .catch((err) => {
        throw err;
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Movie = require("./../models/movie")(sequelize, Sequelize);
db.Review = require("./../models/review")(sequelize, Sequelize);
db.User = require("./../models/user")(sequelize, Sequelize);

// association
db.Movie.hasMany(db.Review);
db.Review.belongsTo(db.Movie);


module.exports = db;