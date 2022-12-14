var express = require("express")
var router = express.Router()
var passport = require("../config/passport")
var xulydb = require("../CRUD/xulydb")
var Sendmail = require("../send_mail/email")
var nodemailer = require('nodemailer');

router.get("/", (req, res, next) => {
    //Sendmail.send_mail('it@diamondplace.com.vn','it@diamondplace.com.vn',"Test log mail")
    res.render("index")
})

router.get("/signin", (req, res, next) => {
    // hien thi trang va truyen lai nhung tin nhan tu phia server neu co
    var messages = req.flash('error')
    res.render("signin", {
        messages: messages,
        hasErrors: messages.length > 0
    })
})

router.post("/signin",
    passport.authenticate('local.signin', {
        successRedirect: '/thietbi',
        failureRedirect: '/signin',
        failureFlash: true
    })
);

router.post("/signup",
    passport.authenticate('local.signup', {
        successRedirect: '/signin',
        failureRedirect: '/signup',
        failureFlash: true
    })
);

/* GET sign-up page. */
router.get('/signup', function (req, res, next) {
    var messages = req.flash('error')

    res.render('signup', {
        messages: messages,
        hasErrors: messages.length > 0,
    })
});

router.get('/dashboard', async (req, res) => {
    if (req.isAuthenticated()) {
        if (await xulydb.find(req.user.username)) {
            let data = await xulydb.docUser()
            //console.log(data)
            res.render("mainSbAdmin/dashboard", {
                _username: req.user.username,
                data: data,
                activeuser: 'active',
                activetb: '',
                activeedittb: '',
                activesendmail: '',
            })
        } else res.redirect("/thietbi")

    } else {
        res.redirect("/signin")
    }
})

router.get('/thietbi', async (req, res) => {
    if (req.isAuthenticated()) {
        let data = await xulydb.docTb()
        res.render("mainSbAdmin/dbthietbi", {
            _username: req.user.username,
            data: data,
            activeuser: '',
            activetb: 'active',
            activeedittb: '',
            activesendmail: '',
        })
    } else {
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
router.get('/editthietbi', async (req, res) => {
    res.render("mainSbAdmin/dbthietbi-edit", {
        _username: req.user.username,
        activeuser: '',
        activetb: '',
        activeedittb: 'active',
        activesendmail: '',
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

router.post('/suatb', async (req, res) => {
    res.render("mainSbAdmin/dbthietbi-edit", {
        _username: req.user.username,
        activeuser: '',
        activetb: '',
        activeedittb: 'active',
        activesendmail: '',
        Ma: req.body.code,
    })
})
router.post('/delete', async (req, res) => {
    if (req.isAuthenticated()) {
        let a = await xulydb.xoaTb(req.body.Ma)
        if (a == true) {
            res.redirect("/thietbi")
        } else {
            res.send("Loi khong xoa duoc")
        }


    } else {
        res.redirect("/signin")
    }

})

router.post('/searchedit', async (req, res) => {
    //console.log(req.body.txtsearch)
    let doc = await xulydb.timTb(req.body.txtsearch)
    if (doc) {
        //console.log(doc)
        res.render("mainSbAdmin/dbthietbi-edit", {
            _username: req.user.username,
            activeuser: '',
            activetb: '',
            activeedittb: 'active',
            activesendmail: '',
            data: doc,
        })
    } else {
        res.render("mainSbAdmin/dbthietbi-edit", {
            _username: req.user.username,
            activeuser: '',
            activetb: '',
            activeedittb: 'active',
            activesendmail: '',
            data: dat,
        })
    }


})

router.get("/themthietbi", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("mainSbAdmin/themthietbi", {
            _username: req.user.username,
            activeuser: '',
            activetb: '',
            activeedittb: '',
            activethem: 'active',
            activesendmail: '',
        })
    } else {
        res.redirect("/signin")
    }
})

router.post("/themtb", (req, res) => {
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

router.post("/capnhat", (req, res) => {
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
    xulydb.updatetb(req.body.txtma, doc)
    res.redirect('/thietbi')
})

router.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/signin')
})

router.post('/sendmail', async (req, res) => {
    var mails = [
        'help-enom@gkcentralhotel.com',
    ];
    var textareacontent = req.body.textareacontent;
    console.log(textareacontent)
    var transporter = nodemailer.createTransport({ // config mail server
        host: process.env.hostmail,
        port: process.env.portmail,
        type: 'login',
        secure: true,
        auth: {
            user: process.env.usermail, //T??i kho???n gmail v???a t???o
            pass: process.env.passmail, //M???t kh???u t??i kho???n gmail v???a t???o
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    for (let i in mails) {
        console.log(mails[i])
        var content = '';
        content += `
    <div style="padding: 10px; background-color: #003375">
        <div style="padding: 10px; background-color: white;">
            <h4 style="color: #0085ff">G???i mail v???i nodemailer v?? express</h4>
            <span style="color: black">` + textareacontent + `t??n mail: ` + mails[i] + `</span> <br>
            <span style="color: green">Ch??c b???n m???t ng??y t???t l??nh !!!</span>
        </div>
    </div>
    `;

        var mainOptions = { // thi???t l???p ?????i t?????ng, n???i dung g???i mail
            from: 'it@diamondplace.com.vn',
            to: mails[i],
            cc: req.body.txtemailcc,
            subject: req.body.txtsubject,
            text: 'Your text is here',//Th?????ng thi m??nh kh??ng d??ng c??i n??y thay v??o ???? m??nh s??? d???ng html ????? d??? edit h??n
            html: content,//N???i dung html m??nh ???? t???o tr??n kia :)),
            // attachments: [{   // file on disk as an attachment
            //     filename: 'text3.txt',
            //     path: 'D:/NguyenDuyTan/ChanMail.txt' // stream this file
            // },]
        }

        transporter.sendMail(mainOptions, function (err, info) {
            if (err) {
                console.log(err);
                //console.log('Khong gui duoc ' + mainOptions.to)
                req.flash('mess', 'L???i g???i mail: ' + err); //G???i th??ng b??o ?????n ng?????i d??ng
                req.flash('hasError', 'true')
                res.redirect('/sendmailhtml');

            } else {
                console.log('Message sent: ' + info.response);
                console.log('da gui thanh cong ' + mails[i])
                req.flash('mess', 'Email test ???? ???????c g???i ?????n t??i kho???n c???a b???n'); //G???i th??ng b??o ?????n ng?????i d??ng
                req.flash('hasError', 'false')
                res.redirect('/sendmailhtml');
            }
        });
    }
    // var content = '';
    // content += `
    // <div style="padding: 10px; background-color: #003375">
    //     <div style="padding: 10px; background-color: white;">
    //         <h4 style="color: #0085ff">G???i mail v???i nodemailer v?? express</h4>
    //         <span style="color: black">` + textareacontent + `</span> <br>
    //         <span style="color: green">Ch??c b???n m???t ng??y t???t l??nh !!!</span>
    //     </div>
    // </div>
    // `;

    // var mainOptions = { // thi???t l???p ?????i t?????ng, n???i dung g???i mail
    //     from: 'it@diamondplace.com.vn',
    //     to: mails,
    //     cc: req.body.txtemailcc,
    //     subject: "TEST MAIL BY NODEJS and EXPRESS",
    //     text: 'Your text is here',//Th?????ng thi m??nh kh??ng d??ng c??i n??y thay v??o ???? m??nh s??? d???ng html ????? d??? edit h??n
    //     html: content,//N???i dung html m??nh ???? t???o tr??n kia :)),
    //     // attachments: [{   // file on disk as an attachment
    //     //     filename: 'text3.txt',
    //     //     path: 'D:/NguyenDuyTan/ChanMail.txt' // stream this file
    //     // },]
    // }

    // transporter.sendMail(mainOptions, function (err, info) {
    //     if (err) {
    //         console.log(err);
    //         console.log('Khong gui duoc ' + mainOptions.to)
    //         req.flash('mess', 'L???i g???i mail: ' + err); //G???i th??ng b??o ?????n ng?????i d??ng
    //         req.flash('hasError', 'true')
    //         res.redirect('/sendmailhtml');

    //     } else {
    //         console.log('Message sent: ' + info.response);
    //         console.log('da gui thanh cong ' + mainOptions.to)
    //         req.flash('mess', 'Email test ???? ???????c g???i ?????n t??i kho???n c???a b???n'); //G???i th??ng b??o ?????n ng?????i d??ng
    //         req.flash('hasError', 'false')
    //         res.redirect('/sendmailhtml');
    //     }
    // });
    
    
})

router.get('/sendmailhtml', (req, res) => {
    
    res.render("mainSbAdmin/sendmail", {
        _username: req.user.username,
        activeuser: '',
        activetb: '',
        activeedittb: '',
        activethem: '',
        activesendmail: 'active',
        mess: req.flash('mess'),
        hasError: req.flash('hasError')
    })
})

module.exports = router