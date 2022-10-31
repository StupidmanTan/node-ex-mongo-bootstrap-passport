const mongooge = require("mongoose")
const Schema = mongooge.Schema

const schema = new Schema({
    Ma_Voucher_su_dung: {type: String, required: true},
    Ngay_su_dung: {type: String, required: false},
    So_Hop_Dong_Su_Dung: {type: String, required: false},
    NVKD: {type: String, required: false},
    KH_chuyennhuong: {type: String, required: false},
    Ngay_Tiec: {type: String, required: false},
    TinhTrangVoucher: {type: String, required: false},
    
})


module.exports = mongooge.model('TABLE_TT_VOUCHER_USED', schema)