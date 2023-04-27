const express = require("express")
const { exceSQL } = require("../tool/mysql")

let router = express.Router()

//拍品搜索接口
router.post("/auctionSearch", (req, resp) => {
  const { text } = req.body
  resp.tool.exceSQL(
    `
    SELECT 
      * 
    FROM 
      onlineauctionplatformdatabase.auctionitems 
    WHERE 1=1 
    AND (
      name LIKE "%${text}%"
      OR 
      author LIKE "%${text}%"
    )
    
    `).then(res => {
      if (res.length) {
        resp.send(resp.tool.ResponseTemp(0, "查询成功", res))
      }
    })
})

//按照id查询拍卖会
router.post("/auctionTopic", (req, resp) => {
  const { id } = req.body
  resp.tool.exceSQL(
    `
    SELECT 
      *
    FROM
      onlineauctionplatformdatabase.auction_topic
    WHERE id = ? 
    `, [id]).then(res => {
      if (res.length) {
        resp.tool.exceSQL(
          `
          SELECT 
            a.*
          FROM
            onlineauctionplatformdatabase.auctionitems AS a,
            (SELECT auctionitems_id 
            FROM onlineauctionplatformdatabase.auction_ti 
            WHERE auction_topic_id = ?
            ) AS ti
          WHERE a.id IN(ti.auctionitems_id)
          `, [id]).then(res2 => {
            resp.send(resp.tool.ResponseTemp(0, "查询成功", {
              topic: res[0],
              items: res2
            }))
          })

      }
    })
})

//按照id查询拍品
router.post("/auctionitems", (req, resp) => {
  const { id } = req.body
  resp.tool.exceSQL(
    `
    SELECT 
      * 
    FROM 
      onlineauctionplatformdatabase.auctionitems 
    WHERE id = ?
    `, [id]).then(res => {
      if (res.length) {
        const clickvolume = res[0].clickv_olume
        resp.tool.exceSQL(`
        UPDATE 
          auctionitems 
        SET
          clickv_olume = ?
        WHERE id =  ?;
        `, [clickvolume + 1, id])

        resp.send(resp.tool.ResponseTemp(0, "查询成功", res[0]))
      }
    })
})
//查询正在开始的拍卖信息
router.get("/auctions", (req, resp) => {
  resp.tool.exceSQL(`
  SELECT 
    *
  FROM
    onlineauctionplatformdatabase.auction_topic
  ORDER BY start_time
  `).then(res => {
    if (res.length) {
      const id = res[0].id
      resp.tool.exceSQL(`
      SELECT 
        a.*
      FROM
        onlineauctionplatformdatabase.auctionitems AS a,
        (SELECT auctionitems_id 
        FROM onlineauctionplatformdatabase.auction_ti 
        WHERE auction_topic_id = ?
        ) AS ti
      WHERE a.id IN(ti.auctionitems_id)
      `, [id]).then(res2 => {
        if (res2) {
          resp.send(resp.tool.ResponseTemp(0, "查询成功", {
            topic: res[0],
            items: res2
          }))
        }
      })
    }
  })
})
//添加关注
router.post("/likes", (req, resp) => {
  const { userId, auctionId } = req.body
  resp.tool.exceSQL(`
  INSERT INTO onlineauctionplatformdatabase.mylike (
    user_id,
    auction_id
  ) 
  VALUES(?,?);
  `, [userId, auctionId]).then(res => {
    if (res.affectedRows === 1) {
      resp.send({
        code: 0,
        msg: '添加成功'
      })
    }
  })
})
//更具用户id查询用户关注
router.post("/like_user", (req, resp) => {
  const { id } = req.body
  resp.tool.exceSQL(`
  SELECT 
    *
  FROM
    onlineauctionplatformdatabase.auctionitems ,
    (SELECT 
      auction_id 
    FROM
      onlineauctionplatformdatabase.mylike 
    WHERE user_id = 1) AS ml
    WHERE id IN (ml.auction_id)
  `, [id]).then(res => {
    if (res.length) {
      resp.send(resp.tool.ResponseTemp(0, '查询成功', res))
    }
  })
})



module.exports = router