// ====== 方法1：把所有请求的地址封装成一个方法，好处就是有个归总 ======
//引入request.js文件
import request from "./request";
export function updateUserInfo(data ,user){
    return request({
        url: "/user/updateUserInfo",
        method: "Get",
        params:{
            'user':user,
            'username':data.username,
            'password':data.password,
            'name':data.name
        }
    })
}
export function addUser(data){
    return request({
        url: "/user/addUser",
        method: "POST",
        data
    })
}
export function getUserInfo(data) {
    return request({
        url: "/user/getUserInfo", // 这个地址是去掉公共地址剩下的地址
        method: "GET", // 请求方式 支持多种方式  get post put delete 等等
        params: {
            'username': data
        }
    })
}

export function getLogin(data) {
    return request({
        url: "/user/login", // 这个地址是去掉公共地址剩下的地址
        method: "POST", // 请求方式 支持多种方式  get post put delete 等等
        data //发送请求要配置的参数 无参数的情况下也可以不写
    })
}
export function addIndexNode(data) {
    return request({
        url: "/index/addIndexNode", // 这个地址是去掉公共地址剩下的地址
        method: "POST", // 请求方式 支持多种方式  get post put delete 等等
        data
    })
} export function deleteIndexNode(data) {
    return request({
        url: "/index/deleteIndexNode", // 这个地址是去掉公共地址剩下的地址
        method: "GET", // 请求方式 支持多种方式  get post put delete 等等
        params: {
            'id': data
        }
    })
}
export function getIndex(data) {
    return request({
        url: "/index/getIndex", // 这个地址是去掉公共地址剩下的地址
        method: "get", // 请求方式 支持多种方式  get post put delete 等等
        data
    })
}
export function getOriginalIndex(data) {
    return request({
        url: "/index/getOriginalIndex",
        method: "get",
    })
}
export function getIndexNum(data) {
    return request({
        url: "/index/getIndexNum", // 这个地址是去掉公共地址剩下的地址
        method: "get", // 请求方式 支持多种方式  get post put delete 等等
        data
    })
}
export function searchPassage(input,username) {
    return request({
        url: "/passage/searchPassage",
        method: "get",
        params: {
            'input': input,
            'username':username,
        }
    })
}
export function getPassage(data) {
    return request({
        url: "/passage/getPassage",
        method: "get",
        params: {
            'aid': data
        }
    })
}
export function addPassageText(data) {
    return request({
        url: "/passage/addPassageText",
        method: "get",
        params: {
            'aid': data.aid,
            'level': data.level,
            'content': data.content
        }
    })
}
export function addPassageTextUp(data) {
    return request({
        url: "/passage/addPassageTextUp",
        method: "get",
        params: {
            'aid': data.aid,
            'level': data.level,
            'content': data.content,
            'xuanzhongorderid':data.orderid
        }
    })
}
export function deletePassageContent(data) {
    return request({
        url: "/passage/deletePassageContent",
        method: "get",
        params: {
            'aid': data.aid,
            'orderid': data.orderid
        }
    })
}


export function getNote(data,username) {
    return request({
        url: "/note/getNote",
        method: "get",
        params: {
            'aid': data,
            'username':username
        }
    })
}
export function getNoteByAid(data,username) {
    return request({
        url: "/note/getNoteByAid",
        method: "get",
        params: {
            'aid': data,
            'username':username
        }
    })
}
export function getAllNote(data) {
    return request({
        url: "/note/getAllNote",
        method: "get",
        params:{
            'username':data
        }
    })
}

export function updateNote(data) {
    return request({
        url: "/note/updateNote",
        method: "get",
        params: data
    })
}
export function addMark(data) {
    return request({
        url: "/mark/addmark",
        method: "get",
        params: data
    })
}
export function isMark(data) {
    return request({
        url: "/mark/ismark",
        method: "get",
        params: data
    })
}
export function getLastAid(data) {
    return request({
        url: "/user/getUserLastAid",
        method: "get",
        params: {
            "username":data
        }
    })
}
export function getLastRead(data) {
    return request({
        url: "/user/getUserLastRead",
        method: "get",
        params: {
            "username":data
        }
    })
}
export function setLastAid(data) {
    return request({
        url: "/user/setUserLastAid",
        method: "get",
        params: data
    })
}
export function getAllMark(data) {
    return request({
        url: "/mark/getAllMark",
        method: "get",
        params: {
            "username":data
        }
    })
}
export function deleteMark(data) {
    return request({
        url: "/mark/deletemark",
        method: "get",
        params: data
    })
}

export function deleteNoteByAidOrderid(data) {
    return request({
        url: "/note/deleteNoteByAidOrderid",
        method: "get",
        params: data
    })
}
export function deleteAllNoteByAid(data) {
    return request({
        url: "/note/deleteAllNoteByAid",
        method: "get",
        params: {
            aid: data
        }
    })
}

export function getSearch(data) {
    return request({
        url: "/search/getSearch",
        method: "get",
        params: {
            'username':data
        }
    })
}
export function exportData(){
    return request({
        url:"/exportData",
        method:"GET"
    })
}
