const express = require('express')
const app = express()
const mongoose = require('mongoose');
const db = require('./models/urlshorten');
// const { response } = require('express');
const shortId = require('shortid')

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
app.get('/', async function(req,res) {
    const shortdata=await db.find({})
    // res.send('Server started')
    res.render('index',{shortdata:shortdata});
})

app.post('/short' ,async function(req,res) {
    const fullurl=req.body.fullurl;
    const db1 = new db({
        full : fullurl,
        short:shortId.generate()
      });
    await db1.save();
    console.log('post data : ',db1)
    res.redirect('/');
})

app.get('/shortid/:short',function(req,res){
    const shortid = req.params.short;
    // var url = a db.findone();
    db.findOne({short:shortid},function(err,list)
    {
        if(err) {
            console.log(err);
        }else{
            res.redirect(list.full)
        }
    })
})

app.get('/delete/:id',function(req,res){
    db.deleteOne({short:req.params.id},function(err,list){
        if(err) {
            console.log(err);
        }else{
            console.log(list);
            res.redirect('/');
        }
    })
    
})

mongoose.connect('mongodb://localhost:27017/ShortUrl',
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }  
)
mongoose.connection.on('open',()=>{

    app.listen(4500);
});
// temp.on('error', console.error.bind(console, 'MongoDB connection error:'));