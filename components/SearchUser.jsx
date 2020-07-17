import {Spin, Select} from 'antd'
import {useState, useCallback, useRef } from 'react'
import api from '../lib/api'
import debounce  from "lodash/debounce";

const Option = Select.Option

function SearchUser({onChange, value}) {
    // {current: 0}
    const lastFetchIdRef = useRef(0);
    const [fetching, setFetching] = useState(false)

    const [options, setOptions] = useState([]);

    const fetchUser = useCallback( debounce((value) => {
        console.log('fetching user' ,value);
        lastFetchIdRef.current+=1;
        const fetchId = lastFetchIdRef.current
        setFetching(true);
        setOptions([]);
        api.request({
            url: `/search/users?q=${value}`
        })//in Browser, so no params
            .then(resp=> {
                console.log('user:', resp)
                if(fetchId!==lastFetchIdRef.current) return;
                const data = resp.data.items.map(user=>({
                    text: user.login,
                    value: user.login
                }))
                setFetching(true);
                setOptions(data);
            })


    }, 500), [])

    const handleChange = (value) => {
        setOptions([]);
        setFetching(false);
        onChange(value)
    }

    return <Select
        style={{width: 200}}
        showSearch={true}
        notFoundContent={fetching? <Spin size="small"/>: <span>nothing</span>}
        filterOption={false}
        placeholder="Creator"
        allowClear={true}
        onSearch={fetchUser}
        onChange={handleChange}
        value={value}
    >
        {
            options.map(op=>(
                <Option value={op.value} key={op.value}>{op.text}</Option>
            ))
        }
    </Select>
}

export default SearchUser