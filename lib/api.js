const axios = require('axios')
const isServer = typeof window === 'undefined'

const github_base_url = 'https://api.github.com'

async function requestGithub(method, url, data, headers) {
    console.log('发起github请求', `${github_base_url}${url}`)
    return axios({
        url: `${github_base_url}${url}`,
        method,
        data,
        headers,
    });
}

// req 和 res只有在服务端渲染时才能拿到
async function request({ method = 'GET', url, data = {} }, req, res) {
    console.log('执行环境', isServer)
    if (!url) {
        throw Error('url must provide')
    }

    if (isServer) {
        const session = req.session
        const githubAuth = session.githubAuth || {}
        const headers = {}
        if (githubAuth.access_token) {
            headers[
                'Authorization'
                ] = `${githubAuth.token_type} ${githubAuth.access_token}`
        }
        return requestGithub(method, url, data, headers);
    } else {
        // 在客户端就请求自己的服务
        return axios({
            method,
            url: `/github${url}`,
            data,
        });
    }
}

module.exports = {
    request,
    requestGithub,
}