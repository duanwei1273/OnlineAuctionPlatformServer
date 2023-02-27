const express = require("express")
const { exceSQL } = require("../tool/mysql")

let router = express.Router()

router.get("/login", (req, resp) => {
  resp.tool.exceSQL(`
  SELECT 
    id,
    username,
    phone,
    email,
    creation_time
  FROM
	  users
  LIMIT 1;
  `).then((res) => {
    if (res.length > 0) {
      resp.send(resp.tool.ResponseTemp(0, "查询成功", res[0]))
    }
  })
  // resp.send({
  //   titile: '成功'
  // })
})

router.get("/auctions", (req, resp) => {
  resp.tool.exceSQL(`
  SELECT 
    id,
    name,
    picture,
    auctions,
    creation_time,
    start_time,
    end_time
  FROM
  auction_topic
  LIMIT 3;
  `).then((res) => {
    if (res.length > 0) {
      resp.send(resp.tool.ResponseTemp(0, "查询成功", res))
    }
  })
})


module.exports = router