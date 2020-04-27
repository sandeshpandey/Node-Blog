const express = require('express')
const router = express.Router()
const Article = require('../models/article')


router.get('/new', (req, res)=>{
    res.render('articles/new', {article: new Article() })
})

router.post('/', async (req, res, next) =>{ 
    req.article = new Article();
    next()
}, saveArticleAndRedirect('new'))


router.get('/:slug', async (req, res) =>{  
    try{
        const article =await Article.findOne({slug: req.params.slug});
        if (article == null) res.redirect('/')
        res.render("articles/show",{article:article})
    }catch (err){
        console.log(err);
        res.redirect("back",{error: err.message})
    }
    
})

router.get('/:slug/edit', async (req, res) =>{
    try {
        const article = await Article.findOne({slug: req.params.slug})
        res.render("articles/edit",{article: article})
    } catch (err) {
        console.log(err);
        res.redirect("back",{error: err.message})
    }
    
})

router.put('/:slug/edit', async (req, res, next) => {
    req.article = await Article.findOne({slug: req.params.slug})
    next()
}, saveArticleAndRedirect('edit'))


router.delete('/:slug', async (req, res) =>{
    try {
        await Article.findOneAndDelete({slug: req.params.slug})
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.redirect("back",{error: err.message})
    }
    
})


function saveArticleAndRedirect(path){
    return async (req, res) =>{
        try{
            let article =  req.article
            article.title = req.body.title
            article.description = req.body.description 
            article. markdown = req.body.markdown
            await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (err){
            console.log(err);
            res.render(`articles/${path}`, {article:article, error: err.message})
        }
    }
}



module.exports = router;