const express = require('express');
let router = express.Router()

//根据用户id和状态值查询用户的拍卖记录
router.post('', (req, resp) => {
  let { id, state } = req.body
  if (!state) {
    state = 'auctioning'
  }
  resp.tool.exceSQL(`
    SELECT 
      *
    FROM
      onlineauctionplatformdatabase.auctionitems ,
      (SELECT 
        auction_item_id
      FROM
        onlineauctionplatformdatabase.auction_log 
      WHERE user_id=? AND state=?) AS al
    WHERE  id IN(al.auction_item_id)
  `, [id, state]).then(res => {
    if (res.length) {
      resp.send(resp.tool.ResponseTemp(0, '查询成功', res))
    }
  })
})

//拍卖出价接口
router.post('/bid', (req, resp) => {
  let { userId, auctionId, price } = req.body
  resp.tool.exceSQL(`
    UPDATE 
      onlineauctionplatformdatabase.auctionitems
    SET 
      current_bid = ?
    WHERE 
      id = ?;
  `, [price, auctionId]).then(res => {
    if (res.affectedRows === 1) {
      resp.tool.exceSQL(`
        INSERT INTO onlineauctionplatformdatabase.auction_log (
          user_id,
          auction_item_id,
          current_price
        ) 
        VALUES
          (?,?,?) ;
      `, [userId, auctionId, price]).then(res2 => {
        if (res2.affectedRows === 1) {
          resp.send({
            code: 0,
            msg: '出价成功'
          })
        }
      })
    }
  })
})




module.exports = router;