const dbhandler = require('../dbhandler');

const deleteInv = async (iid) => {
    const { Investigation, Option, Choose } = dbhandler;
    result = {
        success: false,
    };

    catchError = false;

    // 找到该投票所有选项
    options = await Option.findAll({
        where: {
            iid: iid,
        }
    }).catch(()=>{
        catchError = true;
    });

    // 删除所有选项的Chooses以及选项
    for (option of options) {
        // 删除所有Chooses
        await Choose.destroy({
            where: {
                oid: option.oid,
            }
        }).catch(()=>{
            catchError = true;
        });
        // 删除该选项
        await Option.destroy({
            where: {
                oid: option.oid,
            }
        }).catch(()=>{
            catchError = true;
        });
    }

    // 删除该投票
    await Investigation.destroy({
        where: {
            iid: iid,
        }
    }).catch(()=>{
        catchError = true;
    });

    result.success = !catchError;
    return result;
}

const handle_deleteinv = async (ctx, next) => {
    const { iid } = ctx.request.body;
    console.log(`iid:${iid}`);
    // 这一块用来和数据库交互，并且检查是否成功
    const result = await deleteInv(iid);
    ctx.response.body = result;
    ctx.response.status = 200;
    ctx.set('Access-Control-Allow-Origin', `*`);
};

module.exports = {
    'POST /api/deleteinv': handle_deleteinv
};