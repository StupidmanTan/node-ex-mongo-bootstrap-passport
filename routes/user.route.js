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
        'it@diamondplace.com.vn',
        'help-enom@gkcentralhotel.com'
    ];
    var textareacontent = req.body.textareacontent;
    console.log(textareacontent)
    var transporter = nodemailer.createTransport({ // config mail server
        host: process.env.hostmail,
        port: process.env.portmail,
        type: 'login',
        secure: true,
        auth: {
            user: process.env.usermail, //Tài khoản gmail vừa tạo
            pass: process.env.passmail, //Mật khẩu tài khoản gmail vừa tạo
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
            <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
            <span style="color: black">` + textareacontent + `tên mail: ` + mails[i] + `</span> <br>
            <span style="color: green">Chúc bạn một ngày tốt lành !!!</span>
        </div>
    </div>
    `;

        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'it@diamondplace.com.vn',
            to: mails[i],
            cc: req.body.txtemailcc,
            subject: "TEST MAIL BY NODEJS and EXPRESS",
            text: 'Your text is here',//Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
            html: content,//Nội dung html mình đã tạo trên kia :)),
            // attachments: [{   // file on disk as an attachment
            //     filename: 'text3.txt',
            //     path: 'D:/NguyenDuyTan/ChanMail.txt' // stream this file
            // },]
        }

        transporter.sendMail(mainOptions, function (err, info) {
            if (err) {
                console.log(err);
                //console.log('Khong gui duoc ' + mainOptions.to)
                req.flash('mess', 'Lỗi gửi mail: ' + err); //Gửi thông báo đến người dùng
                req.flash('hasError', 'true')
                res.redirect('/sendmailhtml');

            } else {
                console.log('Message sent: ' + info.response);
                console.log('da gui thanh cong ' + mails[i])
                req.flash('mess', 'Email test đã được gửi đến tài khoản của bạn'); //Gửi thông báo đến người dùng
                req.flash('hasError', 'false')
                res.redirect('/sendmailhtml');
            }
        });
    }
    // var content = '';
    // content += `
    // <div style="padding: 10px; background-color: #003375">
    //     <div style="padding: 10px; background-color: white;">
    //         <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
    //         <span style="color: black">` + textareacontent + `</span> <br>
    //         <span style="color: green">Chúc bạn một ngày tốt lành !!!</span>
    //     </div>
    // </div>
    // `;

    // var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
    //     from: 'it@diamondplace.com.vn',
    //     to: mails,
    //     cc: req.body.txtemailcc,
    //     subject: "TEST MAIL BY NODEJS and EXPRESS",
    //     text: 'Your text is here',//Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
    //     html: content,//Nội dung html mình đã tạo trên kia :)),
    //     // attachments: [{   // file on disk as an attachment
    //     //     filename: 'text3.txt',
    //     //     path: 'D:/NguyenDuyTan/ChanMail.txt' // stream this file
    //     // },]
    // }

    // transporter.sendMail(mainOptions, function (err, info) {
    //     if (err) {
    //         console.log(err);
    //         console.log('Khong gui duoc ' + mainOptions.to)
    //         req.flash('mess', 'Lỗi gửi mail: ' + err); //Gửi thông báo đến người dùng
    //         req.flash('hasError', 'true')
    //         res.redirect('/sendmailhtml');

    //     } else {
    //         console.log('Message sent: ' + info.response);
    //         console.log('da gui thanh cong ' + mainOptions.to)
    //         req.flash('mess', 'Email test đã được gửi đến tài khoản của bạn'); //Gửi thông báo đến người dùng
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