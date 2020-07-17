const withCss = require("@zeit/next-css")
const config = require('./config')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const webpack = require('webpack')

if(typeof require !== 'undefined') {
    require.extensions['.css'] = file =>{}
}

module.exports = withBundleAnalyzer(withCss({
    webpack(config) {
        config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
        return config
    },
    publicRuntimeConfig: {
        GITHUB_OAUTH_URL:config.GITHUB_OAUTH_URL,
        OAUTH_URL: config.OAUTH_URL,
    },
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzeConfig: {//help analyze the dependency of models
        server : {
            analyzerMode: 'static',
            reportFilename: '../bundle/server.html'
        },
        browser: {
            analyzerMode: 'static',
            reportFilename: '../bundle/client.html'
        }
    }
}))