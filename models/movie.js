module.exports = (sequelize, Sequelize) => {

    const Movie = sequelize.define('movie', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        duration: {
            type: Sequelize.INTEGER, // duration of movie in seconds,
            allowNull: false
        },
        releasedDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        poster: {
            type: Sequelize.STRING,
            allowNull: false
        },
        wikiLink: {
            type: Sequelize.STRING,
            isUrl: true,
            allowNull: false
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
    });

    return Movie;
}