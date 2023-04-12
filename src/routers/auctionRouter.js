const express = require("express")
const { exceSQL } = require("../tool/mysql")

let router = express.Router()

router.get("/homes", (req, resp) => {
  console.log('1')
  resp.tool.exceSQL(`
  SELECT
    *
  FROM
    auctionitems
  LIMIT 6;
  `).then(res => {
    console.log('1')
    if (res.length) {
      resp.send(resp.tool.ResponseTemp(0, "查询成功", res))
    }
  })
})



module.exports = router