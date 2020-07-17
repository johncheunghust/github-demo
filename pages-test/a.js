import {withRouter} from 'next/router'
// import Comp  from "../components/comp";
import styled from 'styled-components'
import dynamic from "next/dynamic";
// import moment from 'moment'

const Title = styled.h1`
    color:yellow;
    font-size: 40px;
`

const Comp = dynamic(import('../components/comp'))

const A = ({router, name, time})=> (
    <div className="testA">
        <Title>This is Title {time}</Title>
        <Comp> A {router.query.id} {name}</Comp>
        {/*被渲染后生效*/}
        <style jsx>{`
        .testA {color: blue}
        `
        }
        </style>
    </div>
)
A.getInitialProps = async (ctx) =>{
    const moment = await import('moment')
    const promise = new Promise((resolve)=>{
        setTimeout(()=>{
            resolve({
                name: 'John',
                time: moment.default(Date.now()- 59*1000).fromNow()
            })
        }, 1000)
    })
    return await promise
}

export default withRouter(A)