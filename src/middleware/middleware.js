const path = require('path')
const fs = require('fs')
const { exceSQL } = require('../tool/mysql')

let notFoundMF = function (notFoundFilePth) {
  if (!path.isAbsolute(notFoundFilePth)) {
    throw Error("必须传递一个绝对路径")
  }

  return (req, resq) => {

    resq.status(404).sendFile(notFoundFilePth)
  }
}

//日志中间件
let logsM = (req, resp, next) => {
  let method = req.method
  let path = req.path
  let params = {}
  if (method.toLowerCase() === 'get') {
    params = req.query
  } else if (method.toLowerCase() === 'post') {
    params = req.body
  }
  let ua = req.headers["user-agent"]

  exceSQL("insert into log (method, path, params, ua) values (?,?,?,?)", [method, path, JSON.stringify(params), ua]).then((res) => {
    console.log('记录日志成功')
  })

}