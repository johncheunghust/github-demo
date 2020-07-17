import Link from 'next/link'
import Repo from '../../components/Repo'
import api from '../../lib/api'
import withRepoBasic from '../../components/with-repo-basic'
import {Avatar, Button, Select, Spin} from 'antd'
import {useState, useCallback, useEffect} from 'react'
import dynamic from "next/dynamic";
import {getLastUpdated} from '../../lib/util'
import SearchUser from '../../components/SearchUser'

const MdRenderer = dynamic(()=>import('../../components/MarkdownRenderer'))

const Option = Select.Option

const CACHE = [];

function Label ({label}) {
    return (
        <>
            <span className="label" style={{backgroundColor: `#${label.color}`}}>
                {label.name}
            </span>
            <style jsx>{`
                .label{
                    display: inline-block;
                    line-height: 20px;
                    margin-left: 15px;
                    padding: 3px 10px ;
                    border-radius: 3px;
                    font-size: 4px;
                }
                
            `}

            </style>
        </>
    )
}

function IssueDetail({issue}) {
    return (
        <div className="root">

            <MdRenderer content={issue.body} />
            <div className="actions">
                <Button href={issue.html_url} target={"_blank"}>Open Discussion</Button>
            </div>
            <style jsx>{`
                .root {
                    background: #fafafa;
                    padding: 20px;
                }
                .actions {
                    text-align: right;
                }
            `}</style>
        </div>
    )
}

function IssueItem({issue}) {
    const [showDetail, setShowDetail] = useState(false)
    const toggleShowDetail = useCallback(
        () => {
            setShowDetail(detail=> !detail);
        }
        ,[]
    )
    return (
        <div>
        <div className="issue">
            <Button type="primary" size="small" style={{position: 'absolute', right: 10, top: 10, size:10}} onClick={toggleShowDetail}>
                {showDetail? 'Hide Content' : 'Show Content'}
            </Button>
            <div className="avatar">
                <Avatar src={issue.user.avatar_url} shape="square" size={50}/>
            </div>
            <div className="main-info">
                <h6>
                    <span>{issue.title}</span>
                    {
                        issue.labels.map(label => <Label label={label} key={label.id}/>)
                    }
                </h6>
                <p className="sub-info">
                    <span>Updated at {getLastUpdated(issue.updated_at)}</span>
                </p>
            </div>

            <style>{`
                .issue {
                    display: flex;
                    position: relative;
                    padding: 10px;
                  
                }
                .issue:hover {
                    background: #fafafa;
                    
                }
                .issue + .issue {
                    border-top: 1px solic #eee;
                }
                .main-info > h6 {
                    max-width: 600px;
                    font-size: 16px;
                    padding-right: 40px;
                }
                .avartar {
                    margin-right: 20px;
                }
                .sub-info {
                    margin-bottom: 0;
                    
                }
                .sub-info > span + span {
                    display: inline-block;
                    margin-left: 20px;
                    font-size: 12px;
                }
            `}</style>
        </div>
            {showDetail? <IssueDetail issue={issue} />: null}
        </div>
    )
}

function makeQuery(creator, state, labels) {
    let creatorStr = creator? `creator=${creator}` : ''
    let stateStr = state ? `state=${state}` : ''
    let labelStr = ''
    if(labels && labels.length> 0) {
        labelStr = `labels=${labels.join(',')}`
    }
    const arr = []
    if(creatorStr) arr.push(creatorStr);
    if(stateStr) arr.push(stateStr);
    if(labelStr) arr.push(labelStr);

    return `?${arr.join('&')}`;

}

const isServer = typeof window ==='undefined'

function Issues({initialIssues, labels, owner, name}) {
    console.log(issues)

    const [creator, setCreator] = useState()
    const [state, setState] = useState()
    const [label, setLabel] = useState([])
    const [issues, setIssues] = useState(initialIssues);
    const [fetching, setFetching] = useState(false);

    useEffect(()=>{
        if(!isServer) {

            CACHE[`${owner}/${name}`] = labels;
        }
    }, [owner, name, labels])

    const handleCreatorChange = useCallback( (value) => {
        setCreator(value)
    },[])
    const handleStateChange = useCallback( (value) => {
        setState(value)
    },[])
    const handleLabelChange = useCallback( (value) => {
        setLabel(value)
    },[])
    const handleSearch = useCallback( () => {
        setFetching(true)
        api.request({
            url: `/repos/${owner}/${name}/issues${makeQuery(creator,state, label)}`
        })
            .then(resp => {
                setIssues(resp.data)
                setFetching(false)
            }).catch(err=> {
            console.error(err)
            setFetching(false)
        })
    }, [owner, name, creator, state, label])
    return (
        <div className="root">
            <div className="search">
                <SearchUser onChange={handleCreatorChange} value={creator} />
                <Select placeholder="State" onChange={handleStateChange} value={state} style={{width: 200, marginLeft: 20}}>
                    <Option value="all">all</Option>
                    <Option value="open">open</Option>
                    <Option value="closed">closed</Option>
                </Select>

                <Select mode="multiple" placeholder="Label" onChange={handleLabelChange} value={label} style={{flexGrow:1, marginLeft: 20, marginRight: 20}}>
                    {
                        labels&&Array.isArray(labels)?
                            labels.map(la => (<Option value={la.name} key={la.id}>{la.name}</Option>)) : null
                    }
                </Select>
                <Button type="primary" disabled={fetching} onClick={handleSearch}>Search</Button>
            </div>
            {
                fetching ? <div className="loading"><Spin /></div> :
                    <div className="issues">
                        {issues.map(issue=><IssueItem issue={issue} key={issue.id}/>)}
                    </div>
            }

            <style>{`
                .issues{
                    border: 1px solid #eee;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    margin-top: 20px;
                }
                .search {
                    display: flex;
                }
                .loading {
                    height: 400px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    )
}

Issues.getInitialProps = async({ctx}) => {
    const {owner, name} = ctx.query;

    const full_name = `${owner}/${name}`

    const fetches = await Promise.all([
        await api.request({
            url: `/repos/${owner}/${name}/issues`
        }, ctx.req, ctx.res),

        CACHE[full_name] ? Promise.resolve({data: CACHE[full_name]}) : await api.request({
            url: `/repos/${owner}/${name}/labels`
        }, ctx.req, ctx.res) ,
    ])

    return {
        owner: owner,
        name: name,
        initialIssues: fetches[0].data,
        labels: fetches[1].data
    }
}

export default withRepoBasic(Issues, 'issues')