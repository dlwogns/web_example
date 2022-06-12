const express = require('express')
const app = express()
const port = 3001

const bodyParser = require('body-parser');
const {User} = require("./models/User");

const config = require('./config/key')

//application/x-www-form-urlencoded -> 이런 형식의 데이터를 가져오기 위해
app.use(bodyParser.urlencoded({extended: true}));

//application/json -> json형식의 데이터를 가져오기 위해
app.use(bodyParser.json());

const mongoose = require('mongoose')
//mongodb를 편하게 쓰기 위한 api
mongoose.connect(config.mongoURI).then(()=>console.log('MongoDB Connected...')).catch(err => console.log(err))


app.get('/', (req, res) => res.send('asdf'))
//route directory에 핼로 월드가 출력되게 함.

app.post('/register', (req,res)=>{
    //회원 가입 할때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body) 
    //req.body는 json 형식으로 들어오는데,
    //body-parser 덕분에 받을 수 있는 것.
    user.save((err,doc)=>{
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success:true
        })
    }) //from mongodb
})


app.listen(port, ()=> console.log('Example app listening on port ${port} !'))
//app이 listen한다면, terminal에 해당 로그를 출력.