const fs = require('fs')
const Promise = require('bluebird')
const superagent = Promise.promisifyAll(require('superagent'))
const path = require('path')
const request = Promise.promisifyAll(require('request'))
const token = ''
let filePath = path.resolve('./image')
let filenames = []
let requestIds = []
let resUrl = []
function getDir (filename) {
  var waitUntil = new Date(new Date().getTime() + 2 * 1000)
  while (waitUntil > new Date()) {

  }
  return new Promise(function (resolve, reject) {
    var filedir = path.join(filePath, filename)
        // 根据文件路径获取文件信息，返回一个fs.Stats对象
    fs.stat(filedir, function (eror, stats) {
      if (eror) {
        console.warn('获取文件stats失败')
      } else {
        var isFile = stats.isFile()// 是文件
        var isDir = stats.isDirectory()// 是文件夹
        if (isFile) {
          filenames.push(filedir)
        }
        if (isDir) {
          fileDisplay(filedir)// 递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
      }
      resolve()
    })
  })
}
function requestBaidu (file) {
  return new Promise(function (resolve, reject) {
    if (file.match('DS_Store')) {
      console.log('error')
      resolve()
    } else {
      let imageBuf = fs.readFileSync(file)
      imageBuf = imageBuf.toString('base64')
      console.log(file)
      // console.log(imageBuf)
      superagent.post('https://aip.baidubce.com/rest/2.0/solution/v1/form_ocr/request?access_token=' + token)
      .send({image: imageBuf})
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .end(function (err, res) {
        if (err) {

        }
        res = JSON.parse(res.text)
        console.log(res)
        if (res.error_coode) {
          console.log('error')
        } else {
          console.log(res.result[0].request_id)
          requestIds.push(res.result[0].request_id)
          resolve()
        }
      })
    }
  })
}
function getBaidu (id) {
  var waitUntil = new Date(new Date().getTime() + 3 * 10000)
  while (waitUntil > new Date()) {

  }
  return new Promise(function (resolve, reject) {
    superagent.post('https://aip.baidubce.com/rest/2.0/solution/v1/form_ocr/get_request_result?access_token=' + token)
    .send({request_id: id})
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .then(function (res) {
      console.log(res.text)
      let url = JSON.parse(res.text).result.result_data
      resUrl.push(url)
      let filename = './excel/' + id + '.xls'
      let stream = fs.createWriteStream(filename)
      request(url).pipe(stream).on('close', function () {
        console.log(filename + '下载完毕')
        resolve()
      })
    })
  })
}
function fileDisplay (filePath) {
    // 根据文件路径读取文件，返回文件列表
  return new Promise(function (resolve, reject) {
    fs.readdir(filePath, function (err, files) {
      if (err) {
        console.warn(err)
      } else {
              // 遍历读取到的文件列表
        Promise.map(files, function (filename) {
          return getDir(filename)
        }, {concurrency: 5})
        .then(function () {
          return Promise.map(filenames, function (nums) {
            return requestBaidu(nums)
          }, {concurrency: 1})
        })
        .then(function () {
          return Promise.map(requestIds, function (id) {
            return getBaidu(id)
          }, {concurrency: 1})
        })
        .then(function () {
          resolve()
        })
      }
    })
  })
}
module.exports = fileDisplay
