const mongooge = require("mongoose")
const Schema = mongooge.Schema

const schema = new Schema({
    Ma_Voucher: {type: String, required: true},
    Ngay_Phat_Hanh: {type: String, required: false},
    So_Hop_Dong: {type: String, required: false},
    NVKD: {type: String, required: false},
    TenCDCR_TenCTY: {type: String, required: false},
    Nguoi_So_Huu: {type: String, required: false},
    SDT: {type: String, required: false},
    Email: {type: String, required: false},
    Ngay_Tiec: {type: String, required: false},
    Sanh_Tiec: {type: String, required: false},
    GiatriTTT: {type: String, required: false},
    Voucher_Value: {type: String, required: false},
    
})


module.exports = mongooge.model('TABLE_VOUCHER', schema)