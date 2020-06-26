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
            allowNull: false,
            references: {
                model: "users",
                key: "id",
                onDelete: "cascade"
            }
        },
        movieId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "movies",
                key: "id",
                onDelete: "cascade"
            }
        },
        rating: {
            type: Sequelize.TINYINT,
            allowNull: false
        },
        review: {
            type: Sequelize.TEXT
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
    });

    return Review;
}