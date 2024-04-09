const { Router } = require('express');
const io = require("./io")
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');


// 创建路由对象
const router = new Router();

// 定义路由
router.use('/push', (req, res) => {
  const data = req.body.data
  const type = req.body.type

  io.push(type, data)
  res.json({
    code: 0,
    data: null
  })
  
});

// Set up the storage configuration for multer
const storage = multer.diskStorage({
  destination: path.resolve(__dirname, './uploads'), // Destination directory for file uploads
  filename: (req, file, cb) => {
    const extention = file.originalname.split('.').pop()
    const fileName = `${uuidv4()}.${extention}`;
    cb(null, fileName);
  }
});

// Create multer instance with the provided storage configuration
const upload = multer({ storage: storage });


router.use('/upload',  upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const file = req.file;

  file.originalname = Buffer.from(file.originalname, "latin1").toString(
    "utf8"
  );

  let size = file.size / 1024;
  let unit = 'k'

  if(size > 1024) {
    size = size / 1024;
    unit = 'm'
  }

  if(size > 1024) { 
    size = size / 1024;
    unit = 'g'
  }



  res.json({ 
      code: 0,
      data: {
        path: "uploads/" + file.filename,
        fileName: file.originalname,
        type: file.mimetype,
        size: Math.ceil(size) + unit
      },
});
});





module.exports = router;