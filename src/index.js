const express = require("express")
const bodyParser = require('body-parser')
const { expressjwt } = require('express-jwt')
const { exceSQL } = require("./tool/mysql")
const { toolM } = require("./middleware/middleware")
const homeRouter = require("./routers/homeRouter")
const userRouter = require("./routers/userRounter")
const auctionRouter = require("./routers/auctionRouter")
const imageRouter = require('./routers/imageRouter')
const recordRouter = require('./routers/recordRouter')



let app = express()

//挂载工具的中间件
app.use(toolM)


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const secretKey = 'duanwei'
//HS256 使用同一个「secret_key」进行签名与验证 
//RS256 是使用 RSA 私钥进行签名，使用 RSA 公钥进行验证。
// app.use(expressjwt({ secret: 'duanwei', algorithms: ["HS256"] }).unless({ path: [/^\/user\//] }))// /匹配的内容/ ^不在\转义/api
//挂载路由中间键
app.use("/home", homeRouter)

app.use("/user", userRouter)

app.use("/auction", auctionRouter)

app.use('/image', imageRouter);

app.use('/record', recordRouter);




//全局中间件
// app.use(function (err, req, res, next) {
//   if (err.name === "UnauthorizedError") {
//     res.send({
//       status: 401,
//       message: '无效的Token',

//     })
//   }
//   res.send({
//     status: 500,
//     message: '未知的错误',
//   }
//   )
//   // next()
// })



app.listen(5000, () => {
  console.log("OnlineAuctionPlatformServer启动成功")
})