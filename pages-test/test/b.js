import React, {useRef ,useReducer, useState, memo, useCallback, useMemo} from 'react'

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
    const [count, dispatchCount] = useReducer(countReducer, 0);
    const [name, setName] = useState('John')

    const countRef = useRef()//返回同一个对象，不会生成新的对象
    countRef.current = count

    const config = useMemo(()=>({
            text: `count is ${count}`,
            color: count>3? 'red': 'blue'
        })
    , [count])

    const handleButtonClick = useCallback(() => dispatchCount({type: 'add'}), [dispatchCount])

    const handleAlertButtonClick = function() {
        setTimeout(()=>{
            alert(countRef.current)
        }, 2000)
    }

    return (
        <div>
            <input value={name} onChange={e=>setName(e.target.value)}/>
            <Child
                config = {config}
                onButtonClick={handleButtonClick}
            />
            <button onClick={handleAlertButtonClick}>alert count</button>
        </div>
    )
}

const Child = memo(
    function Child( {onButtonClick, config}) {
        console.log('child render');
        return (
            <button onClick={onButtonClick} style={{color: config.color}}>
                {config.text}
            </button>
        )
    }
)

export default MyCountFunc