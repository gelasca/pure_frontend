const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const HOSTNAME = '0.0.0.0'
const PORT = process.argv[2] || 65535

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.doc': 'application/msword',
    '.eot': 'application/vnd.ms-fontobject',
    '.ttf': 'application/x-font-ttf',
  };
  
  const server = http.createServer((req,res)=>{
      
    const parsedUrl = url.parse(req.url)
    const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
    let pathname = path.join(__dirname+'\\assets', sanitizePath);
      
    // if(req.url=='/'&&req.method=='GET'){
        console.log(`${req.url} ${req.headers}`)
        fs.exists(pathname, (exist)=>{
            if(!exist){
                res.statusCode = 404
                res.end(`File ${pathname} not found`)
                return
            }

            if(fs.statSync(pathname).isDirectory){
                pathname += ((req.url=='/')?'\index.html':'')
                console.log('PATHNAME: '+pathname)
            }

            fs.readFile(pathname, (err, data)=>{
                if(err){
                    res.statusCode = 500
                    res.end(`Ending getting the file ${err}.`)
                    return
                }
                else{
                    const ext = path.parse(pathname).ext
                    res.setHeader('content-type',mimeType[ext]||'text/plain')
                    res.end(data)
                }
            })
        })
    // }
    // else{
    //     res.writeHead(404, { 'Content-Type': 'text/plain' });
    //     res.end('Página não encontrada');
    // }

})

server.listen(PORT,HOSTNAME,()=>{
    console.log(`Server is running on host=${HOSTNAME} and port=${PORT}...`)
})
