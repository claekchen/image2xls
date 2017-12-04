const Tesseract = require('tesseract.js')
const fs = require('fs')
let myImage = fs.readFileSync('./image/WechatIMG3627.jpeg')
Tesseract.recognize(myImage)
.progress((message) => {
  console.log(message)
})
.then(function (result) {
  console.log(result)
})
