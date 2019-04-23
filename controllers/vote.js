const dbhandler = require('../dbhandler');

const addChoose = async (options, uid, ip, region) => {
    const { Choose, Investigation, Option } = dbhandler;
    result = {
        existingChoose: false,
        success: false,
    };

    // 查找该用户是否已经投过这个inv:
    // 先用一个option找到iid
    // 找出该iid的所有options
    // 在Choose查找[uid, oid]，若找到则存在
    option_ = await Option.findOne({
        where: {
            oid: options[0],
        }
    });

    console.log('option_',option_);

    options_ = await Option.findAll({
        where: {
            iid: option_.iid,
        }
    });

    console.log("options_",options_)
    

    for (option of options_) {
        await Choose.findOne({
            where: {
                uid: uid,
                oid: option.oid,
            }
        }).then((choose) => {
            if (choose) {
                console.log('find existing choice!');
                result.existingChoose = true;
            }
        });
    }

    let catchError = false;
    // 都没有则写入
    if (!result.existingChoose) {
        for (option of options) {
            await Choose.create({
                uid: uid,
                oid: option,
                ip: ip,
                region: region,
            }).then((choose) => {
                if (choose) {
                    console.log('created:' + JSON.stringify(choose));
                }
            }).catch(() => {
                catchError = true;
            });
        }
        if (!catchError) {
            result.success = true;
        }
    }


    return result;
}

const handle_vote = async (ctx, next) => {
    const { options, uid, ip, region } = ctx.request.body;
    console.log(`options:${options}, uid:${uid}, ip:${ip}, region:${region}`);
    // 这一块用来和数据库交互，并且检查是否成功
    const result = await addChoose(options, uid, ip, region);
    ctx.response.body = result;
    ctx.response.status = 200;
    ctx.set('Access-Control-Allow-Origin', `*`);
};

module.exports = {
    'POST /api/vote': handle_vote
};