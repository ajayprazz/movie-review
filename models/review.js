module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define('review', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: "user",
                key: "id",
                onDelete: "cascade"
            }
        },
        movieId: {
            type: Sequelize.INTEGER,
            references: {
                model: "movie",
                key: "id",
                onDelete: "cascade"
            }
        },
        rating: {
            type: Sequelize.TINYINT
        },
        review: {
            type: Sequelize.TEXT
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
    });

    return Review;
}