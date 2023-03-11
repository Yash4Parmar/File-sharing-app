const multer = require('multer')
const mongose = require('mongoose');
const bcrypt = require('bcrypt')
const File = require('./models/File')

const express = require('express')
const app = express();

const upload = multer({ dest: "uploads" })


mongose.connect("mongodb://127.0.0.1/filesharing")


app.set("view engine", "ejs")

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.render('index')
})

app.post('/upload', upload.single("file"), async (req, res) => {
    const fileData = {
        path: req.file.path,
        orignalName: req.file.originalname
    }
    if (req.body.password != null && req.body.password !== "") {
        fileData.password = await bcrypt.hash(req.body.password, 10)
    }
    const file = await File.create(fileData);
    res.render('index', { fileLink: `${req.headers.origin}/file/${file.id}` })
});

app.get('/file/:id', handleDownload)
app.post('/file/:id', handleDownload)

async function handleDownload(req, res) {
    const file = await File.findById(req.params.id);

    if (file.password !== null) {
        if (req.body.password == null) {
            res.render('password');
            return;
        }
    }

    if (!(await bcrypt.compare(req.body.password, file.password))) {
        res.render('password', { error: true, downloadCount: file.downloadCount });
        return;
    }

    file.downloadCount++;
    await file.save();
    res.download(file.path, file.orignalName);
}

app.listen(3000)