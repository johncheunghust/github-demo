import {useEffect} from 'react'
import getConfig from "next/config";
const {publicRuntimeConfig}  = getConfig()
import {connect} from 'react-redux'
import {MailOutlined} from '@ant-design/icons'
import {Tabs}  from 'antd'
import Router,{withRouter} from 'next/router'
import Repo from '../components/Repo'
const api = require('../lib/api')
import {Button} from 'antd'
import LRU from 'lru-cache'
import {cacheArray}  from "../lib/repo-basic-cache";

const cache = new LRU({
    maxAge: 1000 * 60 * 10
})

let cachedUserRepos, cachedUserStarredRepos


const isServer = typeof window===undefined
function Index({userRepos, userStarredRepos, user, router}) {
    console.log(userRepos, userStarredRepos)

    const tabKey = router.query.key ||'1'

    const handleTabChange = (activeKey)=>{
        Router.push(`/?key=${activeKey}`);
    }

    useEffect(()=>{
        if(!isServer) {
            // cachedUserRepos = userRepos;
            // cachedUserStarredRepos = userStarredRepos;
            if(userRepos) {
                cache.set('userRepos', userRepos);
            }
            if(userStarredRepos) {
                cache.set('userStarredRepos', userStarredRepos);
            }
        }
    }, [userRepos,userStarredRepos])
    useEffect(()=>{
        if(!isServer) {
            cacheArray(userRepos);
            cacheArray(userStarredRepos);
        }
    })
    if(!user||!user.id) {
        return <div className="root">
            <p>Bisou bisou, you have not logged in</p>
            <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>Click On to Login</Button>
            <style jsx>{`
                .root {
                    height:400px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
            `}

            </style>
        </div>
    }

    return (
        <div className="root">
            <div className="user-info">
                <img src={user.avatar_url} alt="user avatar" className="avatar"/>
                <span className="login">{user.login}</span>
                <span className="name">{user.name}</span>
                <span className="bio">{user.bio}</span>
                <p className="email">
                    <MailOutlined style={{marginRight: 10}}/>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                </p>
            </div>
                <div className="user-repos">


                    <Tabs ActiveKey={tabKey} onChange={handleTabChange} animated={false}>
                        <Tabs.TabPane tab="Your Repositories" key="1">
                            {
                                userRepos.map(repo=><Repo key={repo.id} repo={repo}/>)
                            }
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Your Following Repositories" key="2">
                            {
                                userStarredRepos.map(repo=><Repo key={repo.id} repo={repo}/>)
                            }
                        </Tabs.TabPane>
                    </Tabs>
                </div>

            <style jsx>{`
                .root{
                    display: flex;
                    align-items: flex-start;
                    padding: 20px
                }
                .user-info{
                    width: 200px;
                    margin-right: 40px;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                
                }
                .login{
                    font-weight: 800;
                    font-size: 20px;
                    margin-top: 20px;
                }
                .name{
                    font-size: 16px;
                    color: #777;
                }
                .bio {
                    margin-top: 20px;
                    color: #333;
                }
                .avatar{
                    width: 100%;
                    border-radius: 5px;
                }
                .user-repos{
                    flex-grow: 1;
                }
            `}

            </style>
        </div>
    )
}


Index.getInitialProps = async ({ctx, reduxStore})=>{
    const user = reduxStore.getState().user
    if(!user || !user.id) return {}

    if(!isServer) {
        if(cache.get('userRepos') && cache.get('userStarredRepos')) {
            return {
                userRepos: cache.get('userRepos'),
                userStarredRepos: cache.get('userStarredRepos')
            }
        }

    }


    const userRepos = await api.request({
        url: '/user/repos',
    },
        ctx.req,
        ctx.res)

    const userStarredRepos= await api.request({
        url: '/user/starred'
    },
        ctx.req,
        ctx.res)

    return {
        userRepos: userRepos.data,
        userStarredRepos: userStarredRepos.data
    }
}

export default withRouter(connect(function mapState(state){
    return {
        user:state.user
    }
})(Index))