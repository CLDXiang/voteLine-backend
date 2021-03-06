const Sequelize = require('sequelize');
const readlineSync = require('readline-sync');
const { config } = require('./config');
const Op = Sequelize.Op;

const dbhandler = () => {
    const { port_db, schema, username } = config;

    // 权限验证
    const pwd = readlineSync.question('请输入管理员密码：', {
        hideEchoBack: true
    });

    // 连接数据库
    const sequelize = new Sequelize(`mysql://${username}:${pwd}@localhost:${port_db}/${schema}`);
    sequelize.authenticate().then(() => {
        console.log('Connection to the database has been established successfully.');
    }).catch(err => {
        console.error('Unable to connect to the database:');
        throw err;
    });

    // 定义模型
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

    const Choose = sequelize.define('choose', {
        uid: {
            type: Sequelize.BIGINT(20),
            primaryKey: true,
            allowNull: false,
            references: {
                model: User,
                key: 'uid',
            }
        },
        oid: {
            type: Sequelize.BIGINT(20),
            primaryKey: true,
            allowNull: false,
            references: {
                model: Option,
                key: 'oid',
            }
        },
        ip: {
            type: Sequelize.STRING(45),
            allowNull: false,
        },
        region: {
            type: Sequelize.STRING(45),
            allowNull: true,
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
    });

    const models = {
        User: User,
        Investigation: Investigation,
        Option: Option,
        Choose: Choose,
        Op: Op,
        sequelize: sequelize,
    }

    return models;
}

module.exports = dbhandler();

