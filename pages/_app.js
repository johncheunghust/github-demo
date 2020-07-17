import App, {Container} from 'next/app'
import { Provider } from 'react-redux'
import Router from 'next/router'
import Link from 'next/link'

import 'antd/dist/antd.css'
import Layout from "../components/Layout";
import '../styles.css'
import MyContext from '../lib/my-context'
import initializeStore from "../store/store";
import withReduxApp from '../lib/with-redux'
import PageLoading from '../components/PageLoading'

import axios from 'axios'

class  MyApp extends App {
    state = {
        context: 'value',
        loading: false
    }

    startLoading = () =>{
        this.setState({
            loading:true
        })
    }
    stopLoading = () =>{
        this.setState({
            loading:false
        })
    }


    componentDidMount() {
        Router.events.on('routeChangeStart', this.startLoading);
        Router.events.on('routeChangeComplete', this.stopLoading);
        Router.events.on('routeChangeError', this.stopLoading);

        axios.get('/github/search/repositories?q=react')
            .then(resp =>console.log(resp))
    }

    componentWillUnmount() {
        Router.events.off('routeChangeStart', this.startLoading);
        Router.events.off('routeChangeComplete', this.stopLoading);
        Router.events.off('routeChangeError', this.stopLoading);
    }

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
            <Provider store={reduxStore}>
                {this.state.loading? <PageLoading />:null}
                <Layout>
                        <Component {...pageProps}/>
                </Layout>
            </Provider>
        )
    }
}

export default withReduxApp(MyApp)