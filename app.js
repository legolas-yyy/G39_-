const express = require("express")
const ejs = require("ejs")
const fs = require("fs")
// const MongoClient = require("mongodb").MongoClient

// 图片上传插件的使用
const multiparty = require("multiparty")

const DB = require("./mongodb.js")

const DBurl = 'mongodb://127.0.0.1:10086'

const bodyParser = require("body-parser")

const port=3000
const hostname='127.0.0.1'

const app = new express()

// 配置 body-parser 中间件
app.use(bodyParser.urlencoded({
    extended:false
}))
app.use(bodyParser.json())
app.use(express.static(__dirname+"/public"))

app.use('/upload',express.static("upload"))

// app.use(express.static(__dirname+"/upload"))

app.set("views",__dirname+"/views")

app.set("view engine","ejs")

app.engine("html",ejs.__express)

app.get('/',function(request,response){
     response.send('ok 这是首页')
    response.render('main.html')
})

app.get('/login',function(request,response){
     response.send("登录")
    response.render('login.html')
})

app.get('/register',function(request,response){
     response.send("注册页面")
    response.render('register.html')
})

// 实现注册功能
app.post('/doRegister',function(request,response){
    console.log(request.body)
     response.send("doRegister")

    DB.insert('user',{ name:request.body.name,password:md5(request.body.password) },function(error,result){
        if(error){
            console.log("数据添加失败")
            console.log(error)
            response.send("<script>alert('注册失败');location.href='/register'</script>")
            return false
        }else{
            console.log("数据添加成功")
            console.log(result)
            response.redirect('/login')
        }
    })
})


// 实现登录功能
app.post('/doLogin',function(request,response){
    console.log(request.body)

    DB.find('user',{ name:request.body.name,password:md5(request.body.password) },function(error,result){
        if(error){
            console.log(error)
            return false
        }else{
            console.log(result)

            // 如果长度为0，说明没有
            console.log(result.length)
            if(result.length > 0){
                // 长度为0 说明没有数据
                console.log("登录成功")
                response.redirect('/product')
                 response.send("抱歉，你好没有注册")
            }else{
                console.log("登录失败")
                response.send("<script>alert('登陆失败');location.href='/login';</script>")
            }   

        }
    })
})

app.get('/logout',function(request,response){
    response.send("退出登录")
})

app.get('/product',function(request,response){
    response.send("商品列表")
    DB.find('products',{},function(error,data){
        if(error){
            console.log(error)
            return false
        }else{
            console.log(data)
            response.render('product.html',{
                list:data
            })
        }
    })



})
app.get('/productdelete',function(request,response){
    console.log(request.query.id)
    const id = request.query.id
    DB.delete('products',{ "_id":new DB.ObjectID(id) },function(error,result){
        if(error){
            console.log("商品删除失败")
            console.log(error)
            return false
        }else{
            console.log("商品删除成功")
            response.send("<script>alert('成功删除商品~~');location.href='/product'</script>")
        }
    })
})
app.get('/productadd',function(request,response){
     response.send("增加商品")
    response.render('productadd.html')
})

app.post('/doProductAdd',function(request,response){

    // 获取表单数据，以及post过来的图片
    let form = new multiparty.Form()
    form.uploadDir = __dirname+'/public/upload'
    form.uploadDir = 'upload'
    // form.
    form.parse(request,function(error,fields,files){
        if(error){
            console.log(error)
        }else{
            console.log(fields) // 获取表单的数据
            console.log(files) // 图片上传成功返回的数据

            const proName = fields.proName[0]
            const procost = fields.procost[0]
            const propostage = fields.propostage[0]
            const prodes = fields.prodes[0]
            const proImg = files.proImg[0].path

            console.log(proImg)

            DB.insert('products',{ proName,procost,propostage,prodes,proImg },function(error,result){
                if(error){
                    console.log("商品添加失败")
                    console.log(error)
                    return false
                }else{
                    console.log("商品添加成功")
                    response.send("<script>alert('商品添加成功~~');location.href='/product'</script>")
                }
            })
        }
    })

    response.send("ok")

})



app.get('/productedit',function(request,response){
    response.send("编辑商品")
    const id = request.query.id
    console.log(id)
    console.log(new DB.ObjectID(id))
    DB.find('products',{ "_id":new DB.ObjectID(id) },function(error,data){
        if(error){
            console.log("商品获取失败")
            console.log(error)
            return false
        }else{
            console.log("商品获取成功")
            console.log(data)
            response.render("productedit.html",{
               
                item:data[0]
            })
        }
    })
    
})

app.post('/doProductEdit',function(request,response){
    const form = new multiparty.Form()
    form.uploadDir = 'upload'
    form.parse(request,function(error,fields,files){
        if(error){ // 如果发生错误，说明 数据获取失败
            console.log("数据获取失败")
            console.log(error)
            return false
        }else{ // 说明 数据获取成功
            console.log(fields)
            console.log(files)

            { proImg:
                [ { fieldName: 'proImg',
                    originalFilename: '',
                    path: 'upload\\4N8Y0qm3pYEpUxfhqp9ZTzxU',
                    headers: [Object],
                    size: 0 } ] }

            const number = fields.number[0]
            const proName = fields.proName[0]
            const procost = fields.procost[0]
            const propostage = fields.propostage[0]
            const prodes = fields.prodes[0]
            const proImg = files.proImg[0].path
            const originalFilename = files.proImg[0].originalFilename

            // upload\2AzwrPyg8Lf_W2dEDUugEYL6
            // upload\acX9pTBbz9t87svX96vi2cDm.jpg

            //  .jpg结尾
            const proImgReg = /\.jpg$/
            console.log(proImgReg.test(proImg)) 

            console.log(procost)
            console.log(proImg)

        
            DB.update('products',{ "_id":new DB.ObjectID(number) },originalFilename ? { proName,procost,propostage,prodes,proImg }:{ proName,procost,propostage,prodes },function(error,result){
                if(error){
                    console.log("数据更新失败")
                    console.log(error)
                    return false
                }else{
                    console.log("数据更新成功")
                    
                    // 删除多余的图片
                    // 因为 proImg 本身就是 'upload\\YBOa8igscSJ1QQXlFLw6ZFwW.jpg'，所以直接删
                    fs.unlink(proImg,function(error,result){
                        if(error){
                            console.log("图片删除失败")
                            console.log(error)
                            return false
                        }else{
                            console.log("图片删除成功")
                        }
                    })
                    // console.log(result)
                    response.send("<script>alert('商品数据修改成功');location.href='/product'</script>")
                }
            })

        }
    })
    
})



app.listen(port,hostname,function(){
    console.log(`app is running at http://${hostname}:${port}`)
})