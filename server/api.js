const github_prefix_url = 'https://api.github.com'
const axios = require('axios')
const {requestGithub} = require("../lib/api")
module.exports = (server) => {
    server.use(async (ctx, next) => {
        const { path, method } = ctx
        if (path.startsWith('/github/')) {
            console.log(ctx.request.body)
            const session = ctx.session
            const githubAuth = session && session.githubAuth
            const url = ctx.url.replace('/github/', '/')
            // 如果用户登录过就带上请求头
            const token = githubAuth && githubAuth.access_token
            let headers = {}
            if (token) {
                headers[
                    'Authorization'
                    ] = `${githubAuth.token_type} ${githubAuth.access_token}`
            }
            console.log('服务器转发请求', url)
            // post请求从body里去参数
            // get直接url拿参数就行
            const result = await requestGithub(
                method,
                url,
                ctx.request.body || {},
                headers
            )

            ctx.status = result.status
            ctx.body = result.data
        } else {
            await next()
        }
    })
}

// module.exports = (server) =>{
//     server.use(async (ctx, next) =>{
//         const path = ctx.path
//         if(path.startsWith('/github/')) {
//             const githubAuth = ctx.session.githubAuth
//             // console.log(ctx.url)///github/search/repositories?q=react
//             // console.log(ctx.path)///github/search/repositories
//
//             const githubPath = `${github_prefix_url}${ctx.url.replace('/github/', '/')}`//include query
//
//             const token = githubAuth && githubAuth.access_token
//             let headers = {}
//             if(token) {
//                 headers['Authorization'] = `${githubAuth.token_type} ${token}`
//             }
//
//             try {
//                 const result = await axios({
//                     method: 'GET',
//                     url: githubPath,
//                     headers
//                 })
//                 if(result.status===200) {
//                     ctx.body = result.data
//                     ctx.set('Content-Type', 'application/json')
//                 } else {
//                     ctx.status = result.status
//                     ctx.body = {
//                         success: false
//                     }
//                     ctx.set('Content-Type', 'application/json')
//                 }
//             } catch (e) {
//                 console.error(e)
//                 ctx.body = {
//                     success: false
//                 }
//                 ctx.set('Content-Type', 'application/json')
//             }
//
//         } else {
//             await next()
//         }
//     })
// }