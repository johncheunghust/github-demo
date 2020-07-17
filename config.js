const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'

const github = {
    request_token_url: 'https://github.com/login/oauth/access_token',
    client_id: '7719dcc449a12e7f83f4',
    client_secret: '42771ea51b4a3afac6ab67cae5cd8b924f81c7fc',
}

module.exports = {
    github,
    GITHUB_OAUTH_URL,
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${github.client_id}&scope=${SCOPE}`,
}

//token: 46c15f3e6e3b0d356b5ce5890e46c878917f1247