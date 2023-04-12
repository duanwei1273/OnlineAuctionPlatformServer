const express = require("express")
const jwt = require('jsonwebtoken')

let router = express.Router()

//1.注册接口
router.post("/reguster", (req, resp) => {
  const { username, pwd, email, avatar_path, phone } = req.body
  // 创建用户对象
  const user = {
    username,
    pwd,
    email: email ? email : '', // 如果email未提供，则设置为''
    avatar_path: avatar_path ? avatar_path : '',
    phone
  };
  // 验证必填字段
  if (!username || !pwd) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  // 查询是否存在具有相同用户名或电子邮件的用户
  resp.tool.exceSQL(`SELECT * FROM users WHERE username = ? OR email = ? OR phone = ?`, [username, email, phone]).then(res => {
    if (res.length > 0) {
      resp.status(400).send('用户名或电子邮件已经被注册')
    } else {
      // 在用户表中插入新用户
      resp.tool.exceSQL(`INSERT INTO users (username, pwd, email, avatar_path,phone) VALUES (?, ?, ?, ?,?)`,
        [user.username, user.pwd, user.email, user.avatar_path, user.phone]).then(res => {
          if (res.affectedRows > 0) {
            resp.send(resp.tool.ResponseTemp(0, "注册成功", res[0]))
          } else {
            resp.send(resp.tool.ResponseTemp(-2, "注册失败请重试", res[0]))
          }
        })
    }
  })
})
//2.登录接口 
router.post("/login", (req, resp) => {
  const { username, pwd } = req.body
  const sql = 'SELECT * FROM users WHERE username = ? AND pwd = ?'
  resp.tool.exceSQL(sql, [username, pwd]).then(res => {
    console.log(res)
    const secretKey = 'duanwei'
    const user = {
      username: res[0].username
    }
    const token = jwt.sign(user, 'duanwei', { algorithm: 'HS256' })
    // resp.send(resp.tool.ResponseTemp(0, "登录成功", res[0]))//TODO：需要过滤pwd
    resp.send({
      code: 0,
      token,
      data: res[0]
    })
  })
})
//3.获取用户信息
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