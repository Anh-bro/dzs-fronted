import Mock from 'mockjs'
export default {
    getLoginInfo: config => {
        const { username, password } = JSON.parse(config.body)
        if (username === "test" && password === "test") {
            return {
                code: 2000,
                data: {
                    token: Mock.Random.guid(),
                    message: '登录成功'
                }
            }
        } else {
            return {
                code: 9999,
                data: {
                    message: '登录失败'
                }
            }
        }
    },
    addMark: data => {
        console.log(data)
        return {
            code: 200,
            data: {
                message: '添加成功'
            }
        }
    },
    reduceMark: data => {
        console.log(data)
        return {
            code: 200,
            data: {
                message: '添加成功'
            }
        }
    },
    getMark: data => {
        console.log(data)
        return {
            code: 200,
            data: {
                markData: [
                    '2-4',
                    '3-4'
                ],
                message: 'mark成功'
            }
        }
    }
}