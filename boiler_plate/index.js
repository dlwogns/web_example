const express = require('express')
const app = express()
const port = 3001

const mongoose = require('mongoose')
//mongodb를 편하게 쓰기 위한 api
mongoose.connect('mongodb+srv://qwww7777:asdf@youtubeclone.js7e5.mongodb.net/?retryWrites=true&w=majority').then(()=>console.log('MongoDB Connected...')).catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!'))
//route directory에 핼로 월드가 출력되게 함.
app.listen(port, ()=> console.log('Example app listening on port ${port} !'))
//app이 listen한다면, terminal에 해당 로그를 출력.