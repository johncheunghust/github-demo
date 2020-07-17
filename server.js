const Koa = require('koa');
const next = require('next');
const Router = require('koa-router')
const session = require('koa-session')
const Redis = require('ioredis')
const auth = require('./server/auth')
const api = require('./server/api')
const koaBody = require('koa-body')

const dev = process.env.NODE_ENV !== 'production'//处于开发状态
const app = next({dev})//
const handle = app.getRequestHandler()//处理响应
const atob = require('atob')
//创建redis client
const redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
    db: 0,
    password: '980809',
    enableReadyCheck: true,
    autoResubscribe: true,
})

//设置nodejs全局增加一个atob方法
global.atob = atob

const RedisSessionStore = require('./server/session-store')

let index = 0;

app.prepare().then(()=>{
    const server = new Koa();
    const router = new Router();

    server.use(koaBody())

    server.keys = ['John develop github app']//加密字符串
    const SESSION_CONFIG = {
        key: 'jid', //cookie's key
        // maxAge: 10 * 1000,
        store: new RedisSessionStore(redis)//connect to redis
    }

    server.use(session(SESSION_CONFIG, server))

    // 处理github OAuth登录
    auth(server)
    api(server)

    router.get('/a/:id',async (ctx)=>{
        debugger
        const id = ctx.params.id
        await handle(ctx.req, ctx.res, {
            pathname: '/a',
            query: { id }
        })
        ctx.respond = false
    })

    router.get('/api/user/info', async (ctx) => {
        const { userInfo } = ctx.session
        if (userInfo) {
            ctx.body = userInfo
            // 设置头部 返回json
            ctx.set('Content-Type', 'application/json')
        } else {
            ctx.status = 401
            ctx.body = 'Need Login'
        }
    })

    server.use(router.routes())

    server.use(async (ctx, next)=>{
        ctx.req.session = ctx.session
        await handle(ctx.req, ctx.res)
        await next()
    })

    server.use(router.routes());
    server.listen(3000, ()=>{
        console.log('koa server listening on 3000')
    })
})