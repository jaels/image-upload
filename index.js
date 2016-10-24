var express = require('express');
var app = express();

var multer = require('multer');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));


var fs = require('fs');
var http = require('http');

var request = require('request');


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

var maxSize = 10485760;


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

app.post('/upload-url', function(req, res) {
    var url = req.body.url;
    var name = url.slice(url.lastIndexOf('/')+1);
    var fileName = './uploads/' + Date.now() + '_' + Math.floor(Math.random() * 99999999) +  '_' + name;

    var file = fs.createWriteStream(fileName);
    var request = http.get(url, function(response) {
        var size = response.headers['content-length'];
        var type = response.headers['content-type'];
        if(type.slice(0,type.indexOf('/'))!=="image") {
            res.send('you need to upload an image');
            res.abort();
            fs.unlink(fileName);
        };

        if(size>maxSize) {
            res.send('image is too big');
            res.abort();
            fs.unlink(fileName);
        }
        else {
            response.pipe(file);
        }
    });

    file.on('finish', function() {
        res.json({
            success: true,
            file: fileName
        });

    });
});




app.listen(8080);
