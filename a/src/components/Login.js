import React, {useState, useEffect} from 'react';
import axios from 'axios';

function Login(){
    const [inputId, setInputId] = useState('')
    const [inputPw, setInputPw] = useState('')
    // [current condition, Setter function] = useState
    // useState is used to dynamically operate variables
    //input data에 변화가 있을때마다 value를 변경해서 usestate해줌.
    const handleInputId = (e) => {
        //arrow function(=>) is alomost similar to normal function implement. but differences in where this pointer points.
        setInputId(e.target.value)
    }
    const handleInputPw = (e) => {
        setInputPw(e.target.value)
    }
        
    const onClickLogin = () =>{
        console.log('click login')
    }

    useEffect(()=>{
        axios.get('/user_inform/login')
        .then(res => console.log(res))
        .catch()
    },[])

    return(
        <div>
            <h2>Login</h2>
            <div>
                <label htmlFor='input_id'>ID : </label>
                <input type='text' name='input_id' value={inputId} onChange={handleInputId} />
            </div>
            <div>
                <label htmlFor='input_pw'>PW : </label>
                <input type='password' name='input_pw' value={inputPw} onChange={handleInputPw} />
            </div>
            <div>
                <button type='button' onClick={onClickLogin}>Login</button>
            </div>
        </div>
    )



}