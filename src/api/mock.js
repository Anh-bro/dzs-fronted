import Mock from 'mockjs'
import homeApi from './mockData/home'
import permission from './mockData/permission'

Mock.mock('/api/home/getData', homeApi.getHomeData)
Mock.mock('/api/login', 'post', permission.getLoginInfo)
Mock.mock('/api/addMark', 'post', permission.addMark)
Mock.mock('/api/reduceMark', 'post', permission.reduceMark)

Mock.mock('/api/getmark', 'get', permission.getMark)