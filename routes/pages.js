const express = require('express');
const router = express.Router();

//Bring in page Model
let Page = require('../models/page');
//Bring in page Model
let User = require('../models/user');

//Add Route
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_page', {
        title:'Add Page'
    });
});

//Edit Single Page
router.get('/edit/:id', function(req,res){
    Page.findById(req.params.id, function(err, page){
        if(page.author != req.user._id){
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        }
        res.render('edit_page', {
            title:'Edit Page',
            page:page
        });
    })
})

//Add Submit POST Route
router.post('/add', function(req, res){
    req.checkBody('title', 'Title is required').notEmpty();
    //req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    //Get Errors
    let errors = req.validationErrors();

    if(errors){
        res.render('add_page',{
            title:'Add page',
            errors:errors
        })
    }else{
        let page = new Page();
        page.title = req.body.title;
        page.author = req.user._id;
        page.body = req.body.body;

        page.save(function(err){
            if(err){
                console.log(err);
                return;
            }else{
                req.flash('success', 'Page Added');
                res.redirect('/');
            }
        });
    }
})

//Get Single Page
router.get('/:id', function(req,res){
    Page.findById(req.params.id, function(err, page){
        User.findById(page.author, function(err,user){
            res.render('page', {
                page:page,
                author: user.name
            });
        });
    })
})

//Update Submit POST Route
router.post('/edit/:id', function(req, res){
    let page = {}
    page.title = req.body.title;
    page.author = req.body.author;
    page.body = req.body.body;

    let query = {_id:req.params.id}

    Page.update(query, page, function(err){
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success', 'Page Updated')
            res.redirect('/');
        }
    });
})


router.delete('/:id', function(req, res){
    if(!req.user._id){
    }

    let query = {_id:req.params.id}

    Page.findById(req.params.id, function(err,page){
        if(page.author != req.user._id){
            res.status(500).send();
        } else {
            Page.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
    })
})

// Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;