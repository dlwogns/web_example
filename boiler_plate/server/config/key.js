//만약 현재 production이 진행중이라면 
//process.env.NODE_ENV, 즉 환경변수가 production으로 설정됨.
//그러므로 local인지 prod인지 구별하기 위해 사용.

if(process.env.NODE_ENV ==='production'){
    module.exports = require('./prod');
} else{
    module.exports = require('./dev');
}