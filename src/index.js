const express = require("express")

const homeRouter = require("./routers/homeRouter")



let app = express()

//挂载路由中间键
app.use("/", homeRouter)






app.listen(5000, () => {
  console.log("OnlineAuctionPlatformServer启动成功")
})