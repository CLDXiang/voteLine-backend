const dbhandler = require('../dbhandler');

const getInvList = async (count, startIndex, itype, pattern, orderBy) => {
    const { Investigation, Op, sequelize } = dbhandler;
    result = {
        result: [],
        success: false,
    };

    invList = null;

    if (orderBy === 'new') {
        invList = await Investigation.findAll({
            where: {
                itype: {
                    [Op.regexp]: `${itype}.*`
                },
                title: {
                    [Op.regexp]: `.*${pattern}.*`
                }
            },
            order: sequelize.literal('createdAt DESC'),
        });
    } else if (orderBy === 'old') {
        invList = await Investigation.findAll({
            where: {
                itype: {
                    [Op.regexp]: `${itype}.*`
                },
                title: {
                    [Op.regexp]: `.*${pattern}.*`
                }
            },
            order: sequelize.literal('createdAt'),
        });
    }
    // TODO: add more...

    if (invList.length > 0) {
        result.results = invList.slice(startIndex, startIndex + count);
        if (result.results.length > 0) {
            result.success = true;
        }
    }
    return result;
}

const handle_getinvlist = async (ctx, next) => {
    const { count, startIndex, itype, pattern, orderBy } = ctx.request.body;
    // count = ctx.request.body.count,
    // startIndex = ctx.request.body.startIndex,
    // itype = ctx.request.body.itype,
    // pattern = ctx.request.body.pattern,
    // orderBy = ctx.request.body.orderBy;
    console.log(`count:${count}, startIndex:${startIndex}, itype:${itype}, pattern:${pattern}, orderBy:${orderBy}`);
    // 这一块用来和数据库交互，并且检查是否成功
    const result = await getInvList(count, startIndex, itype, pattern, orderBy);
    ctx.response.body = result;
    ctx.response.status = 200;
    ctx.set('Access-Control-Allow-Origin', `*`);
};

module.exports = {
    'POST /api/getinvlist': handle_getinvlist
};