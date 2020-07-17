import {createStore, combineReducers, applyMiddleware} from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools} from 'redux-devtools-extension'
import axios from 'axios'
const LOGOUT = 'LOGOUT'

const userInitialState = {}

function userReducer(state= userInitialState, action) {
    switch(action.type) {
        case LOGOUT: {
            return {}
        }
        default:
            return state
    }
}

const allReducers = combineReducers({
    user: userReducer
})

//action creators
export function logout() {
    return dispatch =>{
        axios.post('/logout')
            .then(resp=>{
                if(resp.status===200) {
                    dispatch({
                        type: LOGOUT
                    })
                }
                else {
                    console.log('logout failed', resp)
                }
            }).catch(e=> {
            console.log('logout failed', e)
        })
    }
}

export default function initializeStore(state) {
    const store = createStore(allReducers,
        Object.assign({},{ user: userInitialState},
            state),
        composeWithDevTools(applyMiddleware(ReduxThunk)) //执行异步dispatch，异步action
    );

    return store
}





