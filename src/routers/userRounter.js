const express = require("express")


let router = express.Router()

//1.注册接口
router.post("/reguster", (req, resp) => {
  const { username, pwd } = req.body

})
//2.获取用户信息
router.post("/userInfo", (req, resp) => {
  const { id } = req.body
  resp.tool.exceSQL(`
    SELECT 
      * 
    FROM
      users
    WHERE 
      id = ? 
  `, [id]).then(res => {
    if (res.length > 0) {
      resp.send(resp.tool.ResponseTemp(0, "查询成功", res[0]))
    }
  })
})


module.exports = router