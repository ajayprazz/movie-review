'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Movie = require("./../models/movie")(sequelize, Sequelize);
db.Review = require("./../models/review")(sequelize, Sequelize);
db.User = require("./../models/user")(sequelize, Sequelize);
db.Genre = require("./../models/genre")(sequelize, Sequelize);
db.MovieGenre = require("./../models/movie_genre")(sequelize, Sequelize);

// association
db.Movie.hasMany(db.Review);
db.Review.belongsTo(db.Movie);
// db.User.hasMany(db.Review);
// db.Review.belongsTo(db.User);

db.Movie.hasMany(db.MovieGenre);
db.MovieGenre.belongsTo(db.Movie);

module.exports = db;