const Sequelize = require('sequelize');
const readlineSync = require('readline-sync');
const { config } = require('./config');
const Op = Sequelize.Op;

const dbhandler = () => {
    const { port_back, port_front, port_db, schema, username } = config;
    const pwd = readlineSync.question('请输入管理员密码：', {
        hideEchoBack: true
    });

    const sequelize = new Sequelize(`mysql://${username}:${pwd}@localhost:${port_db}/${schema}`);
    sequelize.authenticate().then(() => {
        console.log('Connection to the database has been established successfully.');
    }).catch(err => {
        console.error('Unable to connect to the database:');
        throw err;
    });

    // models
    const User = sequelize.define('user', {
        uid: {
            type: Sequelize.BIGINT(20),
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        utype: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        nickname: {
            type: Sequelize.STRING(32),
            allowNull: false,
            unique: true,
        },
        email: {
            type: Sequelize.STRING(64),
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING(32),
            allowNull: false,
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    }, {
            // options
        });

    const Investigation = sequelize.define('investigation', {
        iid: {
            type: Sequelize.BIGINT(20),
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        title: {
            type: Sequelize.STRING(45),
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        timeend: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        multiple: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        itype: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
        createruid: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: User,
                key: 'uid',
            }
        },
        votercount: {
            type: Sequelize.BIGINT(10),
            allowNull: false,
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    });

    const Option = sequelize.define('option', {
        oid: {
            type: Sequelize.BIGINT(20),
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        content: {
            type: Sequelize.STRING(45),
            allowNull: false,
        },
        number: {
            type: Sequelize.BIGINT(10),
            allowNull: true,
        },
        iid: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: Investigation,
                key: 'iid',
            }
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    });

    const models = {
        User: User,
        Investigation: Investigation,
        Option: Option,
        Op: Op,
        sequelize: sequelize,
    }

    return models;
}

module.exports = dbhandler();

