const dbhandler = require('../dbhandler');

const getInv = async (iid, uid) => {
    const { Investigation, Option, User, Choose } = dbhandler;
    result = {
        success: false,
        wrongIid: false,
        inv: null,
        options: [],
        createrName: null,
        voted: false,
        votedOptions: [],
    };

    // 查找inv
    await Investigation.findOne({
        where: {
            iid: iid,
        }
    }).then((inv) => {
        if (!inv) {
            console.log('no such investigation!');
            result.wrongIid = true;
        } else {
            result.inv = inv;
        };
    });

    // 找到了iid
    if (!result.wrongIid) {
        result.options = await Option.findAll({
            where: {
                iid: iid,
            },
        });
        await User.findOne({
            where: {
                uid: result.inv.createruid,
            },
        }).then((user) => {
            if (user) {
                result.createrName = user.nickname;
            }
        });
    }

    if (result.options.length > 0) {
        result.success = true;
        // 查找是否投过票了
        for (option of result.options) {
            await Choose.findOne({
                where: {
                    uid: uid,
                    oid: option,
                }
            }).then((choose) => {
                if (choose) {
                    console.log('find existing choice!');
                    result.voted = true;
                    result.votedOptions.push(choose.oid);
                }
            });
        }
    }
    return result;
}

const handle_getinv = async (ctx, next) => {
    const { iid, uid } = ctx.query;
    console.log(`iid:${iid},uid:${uid}`);
    // 这一块用来和数据库交互，并且检查是否成功
    const result = await getInv(iid, uid);
    ctx.response.body = result;
    ctx.response.status = 200;
    ctx.set('Access-Control-Allow-Origin', `*`);
};

module.exports = {
    'GET /api/getinv': handle_getinv
};