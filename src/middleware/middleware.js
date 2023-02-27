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
function ResponseTemp (code, msg, data) {
  return {
    code,
    msg,
    data
  }
}
let toolM = (req, resp, next) => {
  resp.tool = {
    exceSQL,
    ResponseTemp,
    exceSQLAutoResponseTemp: function (sql, successMsg = '查询成功', handlerResultF = ressult => ressult) {
      exceSQL(sql).then(result => {
        resp.send(0, successMsg, handlerResultF(result))
      }).catch(err => {
        resp.send(ResponseTemp(-1, "api出现错误", null))
      })
    }
  }

  next()
}

module.exports = {
  toolM
}