const dbhandler = require('../dbhandler');

// 用户登录
const Login = async (email, password) => {
    User = dbhandler.User;
    result = {
        success: false,
        wrongEmail: false,
        wrongPwd: false,
        nickname: '',
        userType: 'visitor',
        uid: -1,
    };
    
    // 查找email
    await User.findOne({
        where: {
            email: email,
        }
    }).then((user) => {
        if (!user) {
            console.log('no such email!');
            result.wrongEmail = true;
        };
    });

    // 找到了email
    if (!result.wrongEmail) {
        // 匹配密码
        await User.findOne({
            where: {
                email: email,
                password: password,
            }
        }).then((user) => {
            if (user) {
                // 找到
                console.log('find user!');
                result.success = true;
                result.nickname = user.nickname;
                result.userType = user.utype;
                result.uid = user.uid;
            } else {
                // 密码不对
                console.log('wrong password!');
                result.wrongPwd = true;
            }
        });
    }
    return result;
}

const handle_login = async (ctx, next) => {
    const { email, password } = ctx.request.body;
    console.log(`email:${email}, password:${password}`);
    // 这一块用来和数据库交互，并且检查是否成功
    const result = await Login(email, password);
    ctx.response.body = result;
    ctx.response.status = 200;
    ctx.set('Access-Control-Allow-Origin', `*`);
};

module.exports = {
    'POST /api/login': handle_login
};