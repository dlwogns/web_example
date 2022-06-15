const express = require('express')
const app = express()

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {User} = require("./models/User");

const config = require('./config/key');
const {auth} = require('./middleware/auth');

//application/x-www-form-urlencoded -> 이런 형식의 데이터를 가져오기 위해
app.use(bodyParser.urlencoded({extended: true}));

//application/json -> json형식의 데이터를 가져오기 위해
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose')
//mongodb를 편하게 쓰기 위한 api
mongoose.connect(config.mongoURI).then(()=>console.log('MongoDB Connected...')).catch(err => console.log(err))


app.get('/', (req, res) => res.send('asdf'))
//route directory에 핼로 월드가 출력되게 함.
//******************* 
//register router
//*******************
app.post('/api/users/register', (req,res)=>{
    //회원 가입 할때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body) 
    //req.body는 json 형식으로 들어오는데,
    //body-parser 덕분에 받을 수 있는 것.

    user.save((err,userInfo)=>{
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success:true
        })
    }) //from mongodb
})
//*******************
//login router
//*******************
app.post('/api/users/login', (req, res) =>{
    
    //요청된 이메일을 데이터베이스에서 있는지 확인.
    User.findOne({ email: req.body.email}, (err,user)=>{
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인.
        user.comparePassword(req.body.password , (err, isMatch)=>{
            if(!isMatch)
                return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다"})
            
            //비밀번호까지 맞다면 토큰을 생성.
            user.generateToken((err,user) => {
                if(err) return res.status(400).send(err);
                
                //토큰을 저장한다. 쿠키, 로컬 스토리지
                res.cookie("x_auth",user.token)
                .status(200)
                .json({loginSuccess:true, userId: user._id})
            })
        
        })
    
    })
})


//******************* 
//auth router
//******************* 

app.get('/api/users/auth',auth,(req, res)=>{
    //여기까지 미들웨어(auth) 를 통과해 왔다는 것은
    //authentication이 true라는 것.
    res.statue(200).json({
        _id : req.user._id,
        isAdmin: req.user.role === 0? false:true,
        isAuth:true,
        email: req.user.email,
        name: req.user.name,
        lastname : req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

//******************** 
//logout router
//********************
app.get('/api/users/logout',auth, (req, res)=>{
    User.findOneAndUpdate({_id: req.user._id},
        {token: ""},
        (err, user) =>{
            if(err) return res.json({success: false, err});
            return res.status(200).send({
                success:true
            })
        })
})
const port = 5000
app.listen(port, ()=> console.log('Example app listening on port ${port} !'))
//app이 listen한다면, terminal에 해당 로그를 출력.