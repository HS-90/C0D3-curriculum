import express from 'express'
import path from 'path'

const __dirname = path.resolve()
const app = express()

app.use(express.static('dist'))

app.get("/*", (req, res) => {
	res.sendFile('./dist/index.html', { root: __dirname })
})

app.listen(process.env.PORT || 3000)
