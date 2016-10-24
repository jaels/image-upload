var express = require('express');
var app = express();


var multer = require('multer');

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + '_' + Math.floor(Math.random() * 99999999) +  '_' + file.originalname);
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 2097152
    }
});


app.use(express.static('./public'));

app.use('/uploads', express.static('./uploads'));

app.get('/upload-image', function(req,res) {
    res.sendFile(__dirname+'/public/upload.html');
});

app.post('/upload', uploader.single('file'), function(req, res) {
    if (req.file) {
        res.json({
            success: true,
            file: '/uploads/' + req.file.filename
        });
    } else {
        res.json({
            success: false
        });
    }
});



app.listen(8080);
