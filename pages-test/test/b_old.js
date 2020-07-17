import React, {useState, useRef, useLayoutEffect, useReducer, useEffect, useContext} from 'react'

import MyContext from '../../lib/my-context'

class MyCounter extends React.Component{
    constructor() {
        super();
        this.ref = React.createRef()
    }
    state= {
        count:0
    }
    componentDidMount() {
        // this.ref.current
        this.interval = setInterval(()=>{
            this.setState({count: this.state.count+1})
        }, 1000)
    }

    componentWillUnmount() {
        if(this.interval) clearInterval(this.interval)
    }

    render() {
        return (
            <div>
                <span ref={this.ref}>{this.state.count}</span>
            </div>
        );
    }
}

function countReducer(state, action) {
    switch (action.type) {
        case 'add':
            return state+1
        case 'minus':
            return state-1
        default:
            return state
    }
}

function MyCountFunc() {
    // const[count, setCount] = useState(0)//[a, b]

    const [count, dispatchCount] = useReducer(countReducer, 0)
    const [name, setName] = useState('John')
    const Context = useContext(MyContext)

    const inputRef = useRef()

    // setCount(1)
    // setCount((c)=>c)

    // useEffect(()=>{//渲染后回调
    //     const interval = setInterval(()=>{
    //         // setCount(c=>c+1)
    //         dispatchCount({type: 'add'})
    //     }, 1000)
    //     return ()=> clearInterval(interval)
    // }, [])

    useEffect(()=>{
        console.log('effect invoked')//didmount
        console.log(inputRef)
        return () =>console.log('effect detected')//willUnmount

    }, [count])//dependency数组中的项，如果未变化，则不会执行effect，且不会卸载effect

    //会在任何state更新后，计算新DOM的节点数，还未更新到真实dom页面，执行
    //layout实际使用比较少，如果执行了很多需要长时间运行的代码，会导致渲染时间长，页面卡住
    useLayoutEffect(()=>{
        console.log('Layout effect invoked')//didmount
        return () =>console.log('layout effect detected')//willUnmount
    }, [count])//dependency数组中的项，如果未变化，则不会执行effect，且不会卸载effect

    // return <span>{count}</span>
    return (
        <div>
            <input ref={inputRef} value={name} onChange={(e)=>setName(e.target.value)}/>
            <button onClick={()=>dispatchCount({type: 'add'})}>{count}</button>
            <p>{Context}</p>
        </div>
    )
}

export default MyCountFunc