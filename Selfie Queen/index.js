
const express = require('express')
const bodyParser = require("body-parser");
const fs = require('fs');
const {v4: uuidv4} = require('uuid')
const cors = require('cors')
const app = express();   



app.use('/images', express.static(__dirname +'/uploads'))

app.use(cors())

//configuring express to use body-parseras middle-ware
app.use(bodyParser.json({limit:"50mb"}));  
app.use(bodyParser.urlencoded({limit:"50mb", extended: true, parameterLimit: 50000 }));


let files = {}

app.get('/webcam', (req, res) => {

    res.sendFile('./index.html', {root: __dirname})
})

app.get('/image/:imageid', (req, res) => {
    const image_id = req.params.imageid 

    res.contentType('image/jpeg')

    res.sendFile(`./uploads/${image_id}`, {root: __dirname})
})


app.get('/api/photos', (req, res) => {
    res.send({files: Object.keys(files)})
})


app.post('/api/photos', async (req, res) => {
    
    const data = req.body.data
    const pic_id = uuidv4()
 
    await fs.promises.writeFile(`./uploads/${pic_id}`, data, 'base64', (err) =>{
        if(err) throw err;
    } )

    files[pic_id] = true
    

    res.send({files:Object.keys(files)})
})

app.listen(process.env.PORT || 8123)

