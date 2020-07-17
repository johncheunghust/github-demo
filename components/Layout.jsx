import {Button, Layout, Input, Avatar, Tooltip, Dropdown, Menu} from "antd";
import {GithubOutlined} from '@ant-design/icons'
import {useState, useCallback} from 'react'
import Link from "next/link";
import Container from './Container'

import {connect} from'react-redux'

import getConfig from "next/config";

import axios from 'axios'

import {logout} from '../store/store'

import {withRouter} from 'next/router'

const {publicRuntimeConfig}  = getConfig()

const {Header, Content, Footer} = Layout



const githubIconStyle = {
    color: 'white',
    fontSize: 40,
    display: 'block',
    paddingTop: 10,
    marginRight: 20,
}

const footerStyle = {
    textAlign: 'center'
}

const Comp = ({color, children, style}) => <div style={{color, ...style}}>{children}</div>

function MyLayout ({children, user, logout, router})  {
    const handleLogout = useCallback(()=>{logout()},[logout])

    const userDropDown = (
        <Menu>
            <Menu.Item>
                <a href="javascript:void(0)" onClick={handleLogout}>Log Out</a>
            </Menu.Item>
        </Menu>
    )

    const urlQuery  = router.query &&router.query.query;

    const [search, setSearch]  = useState(urlQuery||'');

    const handleSearchChange = useCallback((e)=>{
        setSearch(e.target.value)
    },[setSearch])

    const handleOnSearch = useCallback(()=>{
        router.push(`/search?query=${search}`)
    }, [search])

    const handleGotoOAuth = useCallback((e)=>{
        e.preventDefault()
        axios.get(`/prepare-auth?url=${router.asPath}`)
            .then(resp=>{
                if(resp.status===200) {
                    location.href = publicRuntimeConfig.OAUTH_URL
                } else {
                    console.log('prepare auth failed', resp)
                }
            })
            .catch(e=>{
                console.log('failed', e)
            })
    }, [])

    return (
        <Layout>
            <Header>
                <Container renderer={<div className="header-inner"/>}>
                <div className="header-left">
                    <div className="logo">
                        <Link href="/">
                        <GithubOutlined style={githubIconStyle}/>
                        </Link>
                    </div>
                    <div>
                        <Input.Search
                            placeholder="Search Repositories"
                            value={search}
                            onChange={handleSearchChange}
                            onSearch={handleOnSearch}
                        />
                    </div>
                </div>
                <div className="header-right">
                    <div className="user">
                        {
                            user &&user.id? (
                                <Dropdown overlay={userDropDown}>
                                    <a href="/">
                                        <Avatar size={40} src={user.avatar_url}/>
                                    </a>
                                </Dropdown>
                            ):(
                                <Tooltip title="click to login">
                                    <a href={`/prepare-auth?url=${router.asPath}`}>
                                        <Avatar size={40} icon="user"/>
                                    </a>
                                </Tooltip>
                            )
                        }

                    </div>
                </div>
                </Container>
            </Header>
            <Content>
                <Container>
                        {children}
                </Container>
            </Content>
            <Footer style={footerStyle}>
                Develop by John @<a href="mailto:johncheung0809@gmail.com">johncheung0809@gmail.com</a>
            </Footer>
            <style jsx>{`
            .header-inner {
                display: flex;
                justify-content: space-between;
            }
            .header-left{
                display: flex;
                justify-content: flex-start;
            }
            `}</style>
            <style jsx global>{
                `
                #__next {
                    height: 100%
                }
                .ant-layout {
                    min-height: 100%
                }
                .ant-layout-header{
                    padding-left: 0;
                    padding-right: 0;
                }
                .and-layout-content {
                    background: #fff
                }
                `
            }</style>
        </Layout>
    )
}

export default connect(function mapState(state){
    return {
        user: state.user,
    }
}, function mapReducer(dispatch) {
    return {
        logout: () => dispatch(logout())
    }
})(withRouter(MyLayout))