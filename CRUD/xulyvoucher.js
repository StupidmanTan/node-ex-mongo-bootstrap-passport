const voucher = require('../model/voucher.model')

async function docVoucher(){
    let docs = await voucher.find();
    return docs
}

module.exports = {
    docVoucher,
}