const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const { config } = require('./config');

const app = new Koa();
const { port_back, port_front } = config;

// app.use(async (ctx, next) => {
//     ctx.set('Access-Control-Allow-Origin', `*`);
//     await next();
// });

app.use(async function (ctx, next) {
    ctx.set("Access-Control-Allow-Origin", '*');
    ctx.set("Access-Control-Allow-Credentials", true);
    ctx.set("Access-Control-Max-Age", 86400000);
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
    if (ctx.request.method == "OPTIONS") {
        ctx.response.status = 200
    }
    await next()
})

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// parse request body:
app.use(bodyParser());

// add controllers:
app.use(controller());

app.listen(port_back);
console.log(`app started at port ${port_back}...`);