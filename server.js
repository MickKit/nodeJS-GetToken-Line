const express = require('express');
let jose = require('node-jose');
//ทำการสร้าง Instance ของ express และสร้างตัวแปร app ขึ้นมาเพื่อรับค่า
const app = express()
//สร้างตัวแปร PORT ขึ้นมารับค่า port ในกรณีที่เราได้กำหนดไว้ใน environment ของเครื่อง
//แต่ถ้าไม่ได้กำหนดไว้ เราจะใช้ค่า 8080 แทน
const PORT = process.env.PORT || 8080

// express.json() and express.urlencoded() are built-in middleware functions to support JSON-encoded and URL-encoded bodies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/gettoken', function(req, res) {
    //const privateKey = req.body.privateKey;
    let privateKey = req.body.privateKey
    const kid = req.body.kid;
    const channelid = req.body.channelid;
    ;
    let header = {
        alg: "RS256",
        typ: "JWT",
        kid: kid
    };

    let payload = {
        iss: channelid,
        sub: channelid,
        aud: "https://api.line.me/",
        exp: Math.floor(new Date().getTime() / 1000) + 60 * 15, // 15 minutes
        token_exp: 60 * 60 * 720, // Token will expire in 30 day
    };

    
    jose.JWS.createSign({format: 'compact', fields: header}, JSON.parse(privateKey))
    .update(JSON.stringify(payload))
    .final()
    .then(result => {
        res.send({
            'JWTToken': result,
          });
    
    });
        
   
  });

//สร้าง route ขึ้นมา 1 ตัว โดยกำหนดให้ path คือ / หรือ index ของ host นั่นเอง
//จากนั้นให้กำหนด response แสดงคำว่า Hello World
app.get('/', (req, res) => res.send('Hello World'))
//run web server ที่เราสร้างไว้ โดยใช้ PORT ที่เรากำหนดไว้ในตัวแปร PORT
app.listen(PORT, () => {
    //หากทำการ run server สำเร็จ ให้แสดงข้อความนี้ใน cmd หรือ terminal
    console.log(`Server is running on port : ${PORT}`)
})
//ทำการ export app ที่เราสร้างขึ้น เพื่อให้สามารถนำไปใช้งานใน project อื่นๆ 
//เปรียบเสมือนเป็น module ตัวนึง
module.exports = app
