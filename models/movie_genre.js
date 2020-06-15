module.exports = (sequelize, Sequelize) => {
    const MovieGenre = sequelize.define('movie_genre', {
        movieId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: "movie",
                key: "id",
                onDelete: "CASCADE"
            }
        },
        genreId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: "genre",
                key: "id",
                onDelete: "CASCADE"
            }
        },
    });

    MovieGenre.removeAttribute('id');

    return MovieGenre;
}