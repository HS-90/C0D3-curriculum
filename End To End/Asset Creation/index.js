const express = require("express")
const app = express()
const bodyParser = require("body-parser");

//configuring express to use body-parseras middle-ware
//configuring express to use body-parseras middle-ware
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json())

app.get('/assetcreation', (req, res) => {
    res.sendFile('./body.html', {root: __dirname})
})

const files = {}

app.post('/assetcreation/api/files', (req, res) => {
  
  const name = req.body.file_name
  const content = req.body.file_content
  const language = req.body.file_language

  files[name] = {content: content, language: language}

  //delete files every 5 minutes
  setInterval(() => {
      delete files[name]
  }, 300000)
  
  res.send(files)
  
})

app.get('/assetcreation/api/files/:filename?', (req, res) => {

    let file = req.params.filename

    if(file){
        if(files[file]){
            res.send(files[file])
        }
        else{
            res.send({error:`file by name of ${file} does not exist.` })
        }
    }

    res.send(files)
})

app.listen(process.env.PORT || 8123)
