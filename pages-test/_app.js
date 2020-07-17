import App, {Container} from 'next/app'
import { Provider } from 'react-redux'

import 'antd/dist/antd.css'
import Layout from "../components/Layout";
import '../styles.css'
import MyContext from '../lib/my-context'
import initializeStore from "../store/store";
import withReduxApp from '../lib/with-redux'

class  MyApp extends App {
    static async getInitialProps(ctx) {
        const {Component} = ctx
        console.log('init app')
        let pageProps = {}
        if(Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }
        return {
            pageProps
        }

    }

    render() {
        const {Component, pageProps, reduxStore} = this.props//每个页面渲染的时候都会作为Component
        return (
                <Layout>
                    <Provider store={reduxStore}>
                            <Component {...pageProps}/>
                    </Provider>
                </Layout>
        )
    }
}

export default withReduxApp(MyApp)