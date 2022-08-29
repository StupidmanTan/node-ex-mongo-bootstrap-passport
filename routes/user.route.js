var express = require("express")
var router =  express.Router()
var passport = require("../config/passport")
router.get("/", (req, res, next) => {
    res.render("index")
})

router.get("/signin", (req, res , next) => {
    // hien thi trang va truyen lai nhung tin nhan tu phia server neu co
    var messages = req.flash('error')
    res.render("signin",{
        messages: messages,
        hasErrors: messages.length > 0
    })
})

router.post("/signin",
    passport.authenticate('local.signin', { successRedirect: '/dashboard',
                                  failureRedirect: '/signin',
                                  failureFlash: true })
);

router.post("/signup", 
passport.authenticate('local.signup', { successRedirect: '/signin',
                                  failureRedirect: '/signup',
                                  failureFlash: true })
);

/* GET sign-up page. */
router.get('/signup', function(req, res, next) {
    var messages = req.flash('error')
   
    res.render('signup',{ 
      messages: messages,
      hasErrors: messages.length > 0,
     })
  });

router.get('/dashboard', (req, res) => {
    if(req.isAuthenticated()){
        res.render("dashboard",{
            username: req.user.username
        })
    }else{
        res.redirect("/signin")
    }
})

router.post('/logout',(req, res) => {
    req.session.destroy()
    res.redirect('/signin')
})

module.exports = router