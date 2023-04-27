const { response } = require('express');
const express = require('express');
const multer = require('multer');
const path = require('path');
let router = express.Router()

// 配置文件上传的目录和文件名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images')); // 上传文件保存的目录
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, Date.now() + '-' + fileName); // 上传文件保存的文件名
  }
});

// 创建multer对象，配置文件上传规则
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image/')) {
      cb(null, true);
    } else {
      cb(null, false);

      return cb(new Error('Only image files are allowed!'));
    }
  }
});

// 处理文件上传的路由
router.post('/upload', upload.single('image'), (req, resp) => {
  console.log("上传文件的路径：", req);
  // 获取文件保存的完整路径
  const filePath = path.join(req.file.destination, req.file.filename);

  // 构造一个可访问的链接
  const fileUrl = req.protocol + '://' + req.get('host') + '/image/file/' + req.file.filename;


  // 返回可访问的链接
  resp.send(resp.tool.ResponseTemp(0, "上传成功", {
    url: fileUrl
  }))
});

// 提供静态文件访问服务
router.use('/file', express.static(path.join(__dirname, '../public/images')));


module.exports = router;



