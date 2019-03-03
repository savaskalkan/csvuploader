const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb')
const multer = require('multer')
const dbUrl = "mongodb://localhost:27017"
const fs = require('fs')
const csv = require('fast-csv')


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	next()
})


MongoClient.connect(dbUrl, (err, client) => {
	const db = client.db("challenger")
	const col = db.collection("users")
	const username =  'legolas'
	const password = 'elf'
    col.findOne({ username: username }, (err, doc) => {
		//console.log(doc)
		if (!doc) {
		  col.insertOne({username:'legolas',password: password}, (err, doc) => {
			console.log(username, password, 'success')
  
		  })
		}
	  })

})

var upload = multer({ dest: 'uploads/' })
app.post('/upload', upload.single("csvfile"), (req, res) => {

	const items = []

	MongoClient.connect(dbUrl, (err, client) => {
		const db = client.db("challenger")
		const col = db.collection("dates")
		fs.createReadStream('uploads/' + req.file.filename)
			.pipe(csv())
			.on("data", function (data) {
 
				const itemobj = {
					tarih: data[0],
					adet: data[1]
				}
				items.push(itemobj) 
			})
			.on("end", function () {
				col.insertMany(items, (err, doc) => {
					res.json({ success: true, userInfo: doc })
				})
			});

	})


	/*  */
})

app.post('/getadet', (req, res) => {
	const date = req.body.date
	MongoClient.connect(dbUrl, (err, client) => {
		const db = client.db("challenger")
		const col = db.collection("dates") 
		col.findOne({tarih:date},(err,doc)=>{
			res.json(doc)
			//console.log(doc)
		}) 
	})


	/*  */
})

app.post('/control', (req, res) => {
	
	MongoClient.connect(dbUrl, (err, client) => {
		const db = client.db("challenger")
		const col = db.collection("dates") 
		col.find().count((err,count)=>{
			res.json({count:count})
		})
	})


	/*  */
})


app.post('/login', (req, res) => {
	const username = req.body.username
	const password = req.body.password
	
	MongoClient.connect(dbUrl, (err, client) => {
		const db = client.db("challenger")
		const col = db.collection("users") 
		col.findOne({username: username,password:password},(err,doc)=>{
			if(doc)
				res.json({giris:true})
			else
				res.json({giris:false})
		}) 
	})


	/*  */
})

app.listen(9000)