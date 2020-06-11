module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            isEmail: true,
            unique: true
        },
        username: {
            type: Sequelize.STRING,
            unique: true
        },
        password: {
            type: Sequelize.CHAR
        },
        firstname: {
            type: Sequelize.STRING
        },
        lastname: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.TINYINT
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
    });

    return User;
}