var handle_register = async (ctx, next) => {
    console.log(ctx.request);
    var
        email = ctx.request.body.email,
        password = ctx.request.body.password,
        nickname = ctx.request.body.nickname;
    console.log(`email:${email}, password:${password}, nickname:${nickname}`);
    // 这一块用来和数据库交互，并且检查是否成功
    if (true) {
        ctx.response.body = {a: 1, b: 2, res: 'success'};
    }
    ctx.response.status = 200;
    ctx.set('Access-Control-Allow-Origin', `*`);
};

module.exports = {
    'POST /api/register': handle_register
};