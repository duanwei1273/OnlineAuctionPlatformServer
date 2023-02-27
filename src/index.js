const express = require("express")
const bodyParser = require('body-parser')
const { exceSQL } = require("./tool/mysql")
const { toolM } = require("./middleware/middleware")
const homeRouter = require("./routers/homeRouter")
const userRouter = require("./routers/userRounter")



let app = express()

//挂载工具的中间件
app.use(toolM)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//挂载路由中间键
app.use("/home", homeRouter)

app.use("/user", userRouter)






app.listen(5000, () => {
  console.log("OnlineAuctionPlatformServer启动成功")
})