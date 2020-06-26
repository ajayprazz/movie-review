const bcrypt = require("bcrypt");
const saltRound = 10;

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
            unique: true,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: true
        },
        password: {
            type: Sequelize.CHAR,
            allowNull: false
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

    User.beforeCreate(user => {
        const hash = bcrypt.hashSync(user.password, saltRound);
        user.password = hash;
    })

    User.prototype.comparePassword = function (somePassword) {
        return bcrypt.compareSync(somePassword, this.password);
    }

    return User;
}