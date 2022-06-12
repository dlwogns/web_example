const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name : {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname:{
        type: String,
        maxlength: 50
    },
    role: {
        //user가 관리자인지, 일반 유저인지
        type: Number,
        default: 0
    },
    image: String,
    token:{
        type: String
    },
    tokenExp:{
        type: Number
    }
})

userSchema.pre('save', function(next){
    var user = this;
    // 다른 정보들이 바뀌어도 자동으로 전처리로 넘어오기 때문ㅇ
    //password가 다시 암호화 될 수 있음.
    //그러므로 isModified password 옵션을 걸어줘
    //password가 변경될 경우에만 암호화를 다시 걸어주도록 함.
   if(user.isModified('password')){

    //비밀번호 암호화
    //salt를 사용해서 encrypt하는 기능.
    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err) //모든 결과값을 받는 코드를 만들때는 err를 catch해주어야 한다.
            user.password = hash
            next()
        })
    })
    //여기는 register route에서 save하기 전에 전처리를 하기 위한 코드이다.
    //next함수를 써주면 index.js에서 save하는 부분으로 넘어간다.
    } else{
        //다른정보를 바꿀때는 넘어가야 하므로
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainpassword 1234567 && encrypted 
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err),
        cb(null, isMatch)
    })
}


userSchema.methods.generateToken = function(cb){
    //jsonwebtoken을 이용해 토큰 생성.
    var user = this;
    
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null, user)
    })



}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    //token을 decode
    jwt.verify(token, 'secretToken', function(err,decoded){
        //userid를 이용해서 user를 찾은 다음
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인.

        user.findOne({"_id":decoded, "token":token }, function(err,user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}


const User = mongoose.model('User', userSchema)

module.exports = {User} //다른곳에서도 쓸 수 있게 export