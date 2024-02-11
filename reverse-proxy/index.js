const express = require('express')
const httpProxy = require('http-proxy')
require('dotenv').config()

const app = express()

const proxy = httpProxy.createProxy()

const BASE_PATH='https://vercel-prod-output.s3.ap-south-1.amazonaws.com/__outputs/'

app.use((req,res) => {
    const hostname = req.hostname
    const subdomain = hostname.split('.')[0]

    const resolvesTo = `${BASE_PATH}/${subdomain}`

    proxy.web(req,res,{target: resolvesTo, changeOrigin: true})
})

proxy.on('proxyReq', (proxyReq,req,res) => {
    const url = req.url
    if(url === '/'){
        proxyReq.path += 'index.html'
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT}`);
})
