import {useEffect} from 'react'
import axios from 'axios'

import Link from "next/link";
import {Button} from "antd";
import Router from 'next/router'
import {connect} from 'react-redux'
import getConfig from "next/config";


const {publicRuntimeConfig} = getConfig()

import store from '../store/store'

const Index = ({counter, username, rename, add}) => {

    useEffect(()=>{
        axios.get('/api/user/info').then(resp=>console.log(resp))
    })

        return (
            <>
                <span>Count: {counter}</span>
                <span>UserName: {username} </span>
                <input value={username} onChange={(e) => rename(e.target.value)}/>
                <button onClick={()=>add(counter)}>do add</button>
                <a href={publicRuntimeConfig.OAUTH_URL}>去登陆</a>
            </>
        )
}

export default connect(function mapStateToProps(state) {
    return {
        counter: state.counter.count,
        username: state.user.username
    }
}, function mapDispatchToProps(dispatch) {
    return {
        add: (num)=> dispatch({ type: 'ADD', num}),
        rename: (name) => dispatch({type: 'UPDATE_NAME', name})
    }
})(Index)