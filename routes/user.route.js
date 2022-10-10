var express = require("express")
var router =  express.Router()
var passport = require("../config/passport")
var xulydb = require("../CRUD/xulydb")
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
    passport.authenticate('local.signin', { successRedirect: '/thietbi',
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

router.get('/dashboard', async(req, res) => {
    if(req.isAuthenticated()){
        if(await xulydb.find(req.user.username)){
            let data = await xulydb.docUser()
        //console.log(data)
            res.render("mainSbAdmin/dashboard",{
            _username: req.user.username,
            data: data,
            activeuser: 'active',
            activetb: '',
            activeedittb: '',
            })
        }else res.redirect("/thietbi")
        
    }else{
        res.redirect("/signin")
    }
})

router.get('/thietbi', async(req, res) => {
    if(req.isAuthenticated()){
        let data = await xulydb.docTb()
            res.render("mainSbAdmin/dbthietbi",{
            _username: req.user.username,
            data: data,
            activeuser: '',
            activetb: 'active',
            activeedittb: '',
        })
    }else{
        res.redirect("/signin")
    }
})
var dat = {
    Ma: "",
    Mainboard: "",
    RAM: "",
    CPU: "",
    HardDisk: "",
    Monitor: "",
    VideoCard: "",
    OS: "",
    Notes: "",
    BoPhan: "",
    DeXuat: "",
    Loai: "",
    Nguoidung: "",
    Vitri: "",
}
router.get('/editthietbi', async(req, res) => {
    res.render("mainSbAdmin/dbthietbi-edit",{
        _username: req.user.username,
        activeuser: '',
        activetb: '',
        activeedittb: 'active',
        data: dat,
    })
    // if(req.isAuthenticated()){
        
    //         res.render("mainSbAdmin/dbthietbi-edit",{
    //         _username: req.user.username,
    //         activeuser: '',
    //         activetb: '',
    //         activeedittb: 'active',
    //         Ma: req.params.id,
            
    //     })
    // }else{
    //     res.redirect("/signin")
    // }
})

router.post('/suatb', async(req, res) => {
    res.render("mainSbAdmin/dbthietbi-edit",{
            _username: req.user.username,
            activeuser: '',
            activetb: '',
            activeedittb: 'active',
            Ma: req.body.code,
})
})
router.post('/delete', async(req, res) => {
    if(req.isAuthenticated()){
        let a = await xulydb.xoaTb(req.body.Ma)
        if(a == true){
            res.redirect("/thietbi")
        }else{
            res.send("Loi khong xoa duoc")
        }
        
               
    }else{
        res.redirect("/signin")
    }
       
})

router.post('/searchedit', async(req, res) => {
    //console.log(req.body.txtsearch)
    let doc =  await xulydb.timTb(req.body.txtsearch)
    if(doc){
        //console.log(doc)
        res.render("mainSbAdmin/dbthietbi-edit",{
            _username: req.user.username,
            activeuser: '',
            activetb: '',
            activeedittb: 'active',
            data: doc,
})
    }else{
        res.render("mainSbAdmin/dbthietbi-edit",{
            _username: req.user.username,
            activeuser: '',
            activetb: '',
            activeedittb: 'active',
            data: dat,
        })
    }
    
    
})

router.get("/themthietbi", (req, res) => {
    if(req.isAuthenticated()){
            res.render("mainSbAdmin/themthietbi",{
            _username: req.user.username,
            activeuser: '',
            activetb: '',
            activeedittb: '',
            activethem: 'active',
        })
    }else{
        res.redirect("/signin")
    }
})

router.post("/themtb",(req, res) => {
    let doc = {
        Ma: req.body.txtma,
        Mainboard: req.body.txtmain,
        RAM: req.body.txtram,
        CPU: req.body.txtcpu,
        HardDisk: req.body.txthdd,
        Monitor: req.body.txtmonitor,
        VideoCard: req.body.txtvideo,
        OS: req.body.txtOS,
        Notes: req.body.txtnotes,
        BoPhan: req.body.txtbophan,
        DeXuat: req.body.txtdexuat,
        Loai: req.body.txtloai,
        Nguoidung: req.body.txtnguoidung,
        Vitri: req.body.txtvitri,
    }
    xulydb.themtb(doc)
    res.redirect("/themthietbi")
})

router.post("/capnhat",(req, res) => {
    //console.log(req.body)
    let doc = {
        Mainboard: req.body.txtmain,
        RAM: req.body.txtram,
        CPU: req.body.txtcpu,
        HardDisk: req.body.txthdd,
        Monitor: req.body.txtmonitor,
        VideoCard: req.body.txtvideo,
        OS: req.body.txtOS,
        Notes: req.body.txtnotes,
        BoPhan: req.body.txtbophan,
        DeXuat: req.body.txtdexuat,
        Loai: req.body.txtloai,
        Nguoidung: req.body.txtnguoidung,
        Vitri: req.body.txtvitri,
    }
    xulydb.updatetb(req.body.txtma,doc)
    res.redirect('/thietbi')
})

router.post('/logout',(req, res) => {
    req.session.destroy()
    res.redirect('/signin')
})



module.exports = router