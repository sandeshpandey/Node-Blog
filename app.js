const express = require('express');
const app = express();
const methodOverride = require('method-override')
//Database
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/blog',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const Article = require('./models/article')

//App config

app.set('view engine', 'ejs');
app.use (express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))


// Routes config

app.get ('/', async (req, res) => {
    const articles = await Article.find().sort({
        createdAt: 'desc'
    })
    res.render('articles/index', {articles : articles})
})

const articleRouter = require('./routes/article');
app.use('/articles',articleRouter);



app.listen(3000, ()=>{
    console.log('server started');
})