const dbhandler = require('../dbhandler');

// 获取投票列表
const getInvList = async (count, startIndex, itype, pattern, orderBy) => {
    const { Investigation, Op, sequelize } = dbhandler;
    result = {
        results: [],
        success: false,
    };

    invList = null;

    // 排列方式
    if (orderBy === 'new') {
        // 查找满足条件的所有投票
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
        // 查找满足条件的所有投票
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
        // 若有投票，则通过传入参数切片，返回切片结果
        result.results = invList.slice(startIndex, startIndex + count);
        if (result.results.length > 0) {
            result.success = true;
        }
    }
    return result;
}

const handle_getinvlist = async (ctx, next) => {
    const { count, startIndex, itype, pattern, orderBy } = ctx.request.body;
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