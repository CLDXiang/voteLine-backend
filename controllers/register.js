const dbhandler = require('../dbhandler')();

addUser = async(email, password, nickname) => {
    User = dbhandler.User;
    result = {
        existingEmail: false,
        existingNickname: false,
        success: false,
    };
    // 查找email是否已存在
    await User.findOne({
        where: {
            email: email,
        }
    }).then((user) => {
        if (user) {
            console.log('find existing email!');
            result.existingEmail = true;
        };
    });
    // 查找nickname是否已存在
    await User.findOne({
        where: {
            nickname: nickname,
        }
    }).then((user) => {
        if (user) {
            console.log('find existing nickname!');
            result.existingNickname = true;
        }
    });
    // 如果都没有就写入数据库
    if (!result.existingEmail && !result.existingNickname) {
        // 查找最大uid
        maxUid = 0;
        await User.max('uid').then((max) => {
            maxUid = (max || 0);
        });
        // 写入
        await User.create({
            uid: maxUid + 1,
            utype: 'normal',
            nickname: nickname,
            email: email,
            password: password,
        }).then((user) => {
            console.log('created:' + JSON.stringify(user));
            result.success = true;
        });
    }
    return result;
}

const handle_register = async (ctx, next) => {
    const
        email = ctx.request.body.email,
        password = ctx.request.body.password,
        nickname = ctx.request.body.nickname;
    console.log(`email:${email}, password:${password}, nickname:${nickname}`);
    // 这一块用来和数据库交互，并且检查是否成功
    const result = await addUser(email, password, nickname);
    ctx.response.body = result;
    ctx.response.status = 200;
    ctx.set('Access-Control-Allow-Origin', `*`);
};

module.exports = {
    'POST /api/register': handle_register
};