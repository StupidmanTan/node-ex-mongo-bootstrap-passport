
//const mongoose = require("mongoose")
const _user = require("../model/user.model")
const _thietbi = require("../model/tb.model")

//mongoose.connect("mongodb+srv://tkbot:Iqzg8qpVDNMUxTLm@cluster0.zl0wy.mongodb.net/test",{useNewUrlParser:true, useUnifiedTopology: true })
async function docUser(){
    let docs = await _user.find()
    return docs
}

async function find(users){
    let doc = await _user.findOne({username: users})
    
    if(doc.role == 'admin'){
        //console.log(doc)
        return true
    } 
    else {
        return false
    }
}



async function docTb(){
    let docs = await _thietbi.find()
    return docs
}

async function timTb(ab){
    let docs = await _thietbi.findOne({Ma: ab})
    return docs
}

async function xoaTb(_tb){
    try {
        await _thietbi.deleteOne({Ma: _tb})
        return true
    } catch (error) {
        return error
    }
    
    
}

async function updatetb(ma, doc){
    try{
        await _thietbi.updateOne({Ma: ma},doc)
        return true
    }catch(e){
        return false
    }
}

async function themtb(doc){
    //console.log(doc)
    try{
        await _thietbi.create(doc)
        return true
    }catch(e){
        return false
    }
}

module.exports = {
    docUser,
    find,
    docTb,
    xoaTb,
    timTb,
    updatetb,
    themtb,
    
}