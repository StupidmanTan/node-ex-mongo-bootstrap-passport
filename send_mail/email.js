const nodemailer =  require('nodemailer');

//Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
// var transporter =  nodemailer.createTransport({ // config mail server
//     host: process.env.hostmail,
//     port: process.env.portmail,
//     type: 'login',
//     secure: true,
//     auth: {
//         user: process.env.usermail, //Tài khoản gmail vừa tạo
//         pass: process.env.passmail, //Mật khẩu tài khoản gmail vừa tạo
//     },
//     tls: {
//         // do not fail on invalid certs
//         rejectUnauthorized: false
//     }
// });
// // verify connection configuration
// transporter.verify(function (error, success) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("Server is ready to take our messages");
//     }
// });
// var content = '';
// content += `
//     <div style="padding: 10px; background-color: #003375">
//         <div style="padding: 10px; background-color: white;">
//             <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
//             <span style="color: black">Đây là mail test</span> <br>
//             <span style="color: green">Chúc bạn một ngày tốt lành !!!</span>
//         </div>
//     </div>
// `;
// var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
//     from: 'it@diamondplace.com.vn',
//     to: "help-enom@gkcentralhotel.com",
//     subject: 'Test Nodemailer',
//     text: 'Your text is here',//Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
//     html: content ,//Nội dung html mình đã tạo trên kia :)),
//     // attachments: [{   // file on disk as an attachment
//     //     filename: 'text3.txt',
//     //     path: 'D:/NguyenDuyTan/ChanMail.txt' // stream this file
//     // },]
// }
// transporter.sendMail(mainOptions, function(err, info){
//     if (err) {
//         console.log(err);
//         //req.flash('mess', 'Lỗi gửi mail: '+err); //Gửi thông báo đến người dùng
//         //res.redirect('/mail');
//     } else {
//         console.log('Message sent: ' +  info.response);
//         //req.flash('mess', 'Một email đã được gửi đến tài khoản của bạn'); //Gửi thông báo đến người dùng
//         //res.redirect('/mail');
//     }
// });

function send_mail(mail){
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

    var content = '';
    content += `
    <div style="padding: 10px; background-color: #003375">
        <div style="padding: 10px; background-color: white;">
            <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
            <span style="color: black">Đây là mail test</span> <br>
            <span style="color: green">Chúc bạn một ngày tốt lành !!!</span>
        </div>
    </div>
    `;

    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'it@diamondplace.com.vn',
        to: mail,
        cc: "it@diamondplace.com.vn",
        subject: 'Test Nodemailer',
        text: 'Your text is here',//Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
        html: content ,//Nội dung html mình đã tạo trên kia :)),
        // attachments: [{   // file on disk as an attachment
        //     filename: 'text3.txt',
        //     path: 'D:/NguyenDuyTan/ChanMail.txt' // stream this file
        // },]
    }
    transporter.sendMail(mainOptions, function(err, info){
        if (err) {
            console.log(err);
            console.log('Khong gui duoc ' + mainOptions.to)
            //req.flash('mess', 'Lỗi gửi mail: '+err); //Gửi thông báo đến người dùng
            //res.redirect('/mail');
        } else {
            console.log('Message sent: ' +  info.response);
            console.log('da gui thanh cong ' + mainOptions.to)
            //req.flash('mess', 'Một email đã được gửi đến tài khoản của bạn'); //Gửi thông báo đến người dùng
            //res.redirect('/mail');
        }
    });
}

module.exports = {
    send_mail,
 }