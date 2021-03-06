const dbhandler = require('../dbhandler');

// 新建投票
const addInv = async (title, description, timeEnd, multiple, itype, createrUid, options) => {
    const { Investigation, Option } = dbhandler;
    result = {
        success: false,
        iid: null,
    };
    maxIid = 0;
    maxOid = 0;
    // 找到最大的iid
    await Investigation.max('iid').then((max) => {
        maxIid = (max || 0);
    });

    // 写入新投票
    await Investigation.create({
        iid: maxIid + 1,
        title: title,
        description: description,
        timeend: timeEnd,
        multiple: multiple,
        itype: itype,
        createruid: createrUid,
        votercount: 0,
    }).then((inv) => {
        console.log('created:' + JSON.stringify(inv));
        result.success = true;
        result.iid = inv.iid;
    });

    // 写入新选项
    if (result.success === true) {
        // 找到最大oid
        await Option.max('oid').then((max) => {
            maxOid = (max || 0);
        });
        // 逐个写入选项
        options.map(async (option) => {
            maxOid++;
            await Option.create({
                oid: maxOid,
                content: option,
                number: 0,
                iid: result.iid,
            }).then((option) => {
                console.log('created:' + JSON.stringify(option));
            }).catch(() => {
                console.log('error!');
                result.success = false;
            });
        });
    }
    return result;
}

const handle_newinv = async (ctx, next) => {
    const { title, description, timeEnd, multiple, itype, createrUid, options } = ctx.request.body;
    console.log(`title:${title}, description:${description}, timeEnd:${timeEnd},multiple:${multiple}, itype:${itype}, createrUid:${createrUid}, options:${options}`);
    // 这一块用来和数据库交互，并且检查是否成功
    const result = await addInv(title, description, timeEnd, multiple, itype, createrUid, options);
    ctx.response.body = result;
    ctx.response.status = 200;
    ctx.set('Access-Control-Allow-Origin', `*`);
};

module.exports = {
    'POST /api/newinv': handle_newinv
};