const express = require("express")
const { exceSQL } = require("../tool/mysql")

let router = express.Router()
//轮播拍卖会查询接口
router.get("/auctions", (req, resp) => {
  resp.tool.exceSQL(`
  SELECT 
    *
  FROM
    auction_topic
  LIMIT 3;
  `).then((res) => {
    if (res.length > 0) {
      resp.send(resp.tool.ResponseTemp(0, "查询成功", res))
    }
  })
})
//按点击率查询推荐拍品
router.get("/auction_recommend", (req, resp) => {
  resp.tool.exceSQL(`
  SELECT 
    *
  FROM
    onlineauctionplatformdatabase.auctionitems 
  WHERE isAuctining = 0
  ORDER BY  clickv_olume DESC
  LIMIT 6;
  `).then(res => {
    if (res.length) {
      resp.send(resp.tool.ResponseTemp(0, "查询成功", res))
    }
  })
})

//获取即将开拍接口
router.get("/start_shooting", (req, resp) => {
  resp.tool.exceSQL(
    `
    SELECT 
      *
    FROM onlineauctionplatformdatabase.auctionitems 
    AS ti
    where id in 
	    (SELECT  auctionitems_id 
	    FROM onlineauctionplatformdatabase.auction_ti 
	    WHERE auction_topic_id = 
		    ( SELECT id
		      FROM onlineauctionplatformdatabase.auction_topic
		      WHERE end_time IS NULL
		      ORDER BY  start_time 
		      LIMIT 0,1))
    `
  ).then(res => {
    if (res.length) {
      resp.send(resp.tool.ResponseTemp(0, "查询成功", res))
    }
  })
})


module.exports = router