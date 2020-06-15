module.exports = (sequelize, Sequelize) => {
    const Genre = sequelize.define('genre', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            unique: true
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
    });

    return Genre;
}