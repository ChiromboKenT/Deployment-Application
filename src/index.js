const axios = require("axios");
const http = require("http");
const path = require('path')
const config = require("./config")
const fsp = require('fs/promises');
const fs = require('fs')
const zipdir = require('zip-dir')
const FormData = require('form-data');

const remote = `https://${config.GIT_USER}:${config.GIT_PASS}@${config.GIT_URL}`;

//Download directory
const dir = `${path.join(process.cwd(),'Deployments')}`;
//Make Directory if it does not exist
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const simpleGit = require("simple-git");
const git = require("simple-git")(dir);


if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const Server =http.createServer((req, res) =>  {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(config),'utf-8'); //end the response
  })
  
Server.listen(config.PORT, () => console.log(`Listening on: ${config.PORT}`));

Server.on('connection', async (err,stream) => {
    console.log("Someone Connected!!")
    try{
        if(!fs.existsSync(path.join(dir,"candidate-test-nodejs-2021"))){
            const cloneResult =  await git.clone(remote)
        }
        
        const buffer = await zipdir(`${path.join(dir,"candidate-test-nodejs-2021")}`, { saveTo: `${path.join(dir,"candidate-test-nodejs-2021.zip")}`,each: p => console.log(p, "added!") },  async (err, buffer) => 
        {   
            if(err){
                throw new Error(err)
            }
            const fileStream = fs.createReadStream(`${path.join(dir,"candidate-test-nodejs-2021.zip")}`);
            const form = new FormData();
            form.append('largeFile', fileStream, 'large-file.zip');
            const result = await axios.post({
                headers: { "Content-Type": "application/x-zip-compressed" },
                method: "post",
                url: config.AZ_URL,
                auth: {
                  username: config.AZ_USER,
                  password: config.AZ_PASS
                },
                data: stream
              });
            console.log(`Result: ${result} `)
        });
       

    }catch(err){
        console.log(err)
    }
})
  process.on("unhandledRejection", err => {
    console.log(err);
    process.exit(1);
  });
  
