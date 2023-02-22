const path = require('path')
const fs = require('fs')


let notFoundMF = function (notFoundFilePth) {
  if (!path.isAbsolute(notFoundFilePth)) {
    throw Error("必须传递一个绝对路径")
  }

  return (req, resq) => {

    resq.status(404).sendFile(notFoundFilePth)
  }
}