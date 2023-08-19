// ====== 方法1：把所有请求的地址封装成一个方法，好处就是有个归总 ======
//引入request.js文件
import request from "./request";

export function getLogin(data){
    return request({
        url: "/user/login", // 这个地址是去掉公共地址剩下的地址
        method: "POST", // 请求方式 支持多种方式  get post put delete 等等
        data //发送请求要配置的参数 无参数的情况下也可以不写
    })
}
export function addIndexNode(data){
    return request({
        url: "/index/addIndexNode", // 这个地址是去掉公共地址剩下的地址
        method: "POST", // 请求方式 支持多种方式  get post put delete 等等
        data
    })
}export function deleteIndexNode(data){
    return request({
        url: "/index/deleteIndexNode", // 这个地址是去掉公共地址剩下的地址
        method: "GET", // 请求方式 支持多种方式  get post put delete 等等
        params:{
            'id':data
        }
    })
}
export function getIndex(data){
    return request({
        url: "/index/getIndex", // 这个地址是去掉公共地址剩下的地址
        method: "get", // 请求方式 支持多种方式  get post put delete 等等
        data
    })
}
export function getIndexNum(data){
    return request({
        url: "/index/getIndexNum", // 这个地址是去掉公共地址剩下的地址
        method: "get", // 请求方式 支持多种方式  get post put delete 等等
        data
    })
}

export function getPassage(data){
    return request({
        url: "/passage/getPassage", 
        method: "get", 
        params:{
            'aid':data
        }
    })
}

export function getNote(data){
    return request({
        url: "/note/getNote", 
        method: "get", 
        params:{
            'aid':data
        }
    })
}
export function getAllNote(data){
    return request({
        url: "/note/getAllNote", 
        method: "get", 
    })
}

export function updateNote(data){
    return request({
        url: "/note/updateNote", 
        method: "get", 
        params:data
    })
}

export function deleteNoteByAidOrderid(data){
    return request({
        url: "/note/deleteNoteByAidOrderid", 
        method: "get", 
        params:data
    })
}
