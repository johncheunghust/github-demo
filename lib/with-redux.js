import createStore from '../store/store'
import React from 'react'
const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'
import initializeStore from "../store/store";

function getOrCreateStore(initialState) {
    if(isServer) {
        return initializeStore(initialState);
    }
    if(!window[__NEXT_REDUX_STORE__]) {
        window[__NEXT_REDUX_STORE__] = initializeStore(initialState);
    }
    return window[__NEXT_REDUX_STORE__]
}

export default Comp => {
    class withReduxApp extends React.Component {
        constructor(props) {
            super(props)
            // getInitialProps创建了store 这里为什么又重新创建一次？
            // 因为服务端执行了getInitialProps之后 返回给客户端的是序列化后的字符串
            // redux里有很多方法 不适合序列化存储
            // 所以选择在getInitialProps返回initialReduxState初始的状态
            // 再在这里通过initialReduxState去创建一个完整的store
            this.reduxStore = getOrCreateStore(props.initialReduxState)
        }

        render() {
            const { Component, pageProps, ...rest } = this.props
            return (
                <Comp
                    {...rest}
                    Component={Component}
                    pageProps={pageProps}
                    reduxStore={this.reduxStore}
                />
            )
        }
    }


    withReduxApp.getInitialProps = async (ctx) => {
        // console.log('TCL: WithReduxApp.getInitialProps -> ctx', ctx)
        let reduxStore
        // console.log('isServer', isServer)
        if (isServer) {
            const { req } = ctx.ctx
            const session = req.session
            if (session && session.userInfo) {
                reduxStore = getOrCreateStore({
                    user: session.userInfo,
                })
            } else {
                reduxStore = getOrCreateStore()
            }
        } else {
            reduxStore = getOrCreateStore()
        }

        ctx.reduxStore = reduxStore

        let pageProps = {}
        if (typeof Comp.getInitialProps === 'function') {
            pageProps = await Comp.getInitialProps(ctx)
        }

        return {
            ...pageProps,
            initialReduxState: reduxStore.getState(),
        }
    }


    return withReduxApp
}