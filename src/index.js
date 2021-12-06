const axios = require("axios");
const http = require("http");
const path = require('path')
const config = require("./config")
const fs = require('fs')
const zipdir = require('zip-dir')
const request=require('request')
const npm = require('npm-programmatic');



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

const main = async  () => {
  console.log("Someone Connected!!")
    try{
        if(!fs.existsSync(path.join(dir,"candidate-test-nodejs-2021"))){
            const cloneResult =  await git.clone(remote,["--single-branch","--branch","Kenny"])
            
           
            
        }
        const packageBuffer = JSON.parse(fs.readFileSync(path.join(dir,"candidate-test-nodejs-2021","package.json"),'utf-8'))
        const dependencies = Object.keys(packageBuffer['dependencies']) || []
        const InstalledPackagesList = await npm.install(dependencies, {
          cwd:`${path.join(dir,"candidate-test-nodejs-2021")}`,
          output:true
      }

        )
        console.log(InstalledPackagesList)
        const buffer = await zipdir(`${path.join(dir,"candidate-test-nodejs-2021")}`, { saveTo: `${path.join(dir,"candidate-test-nodejs-2021.zip")}`,each: p => console.log(p, "added!") },  async (err, buffer) => 
        {   
            if(err){
                throw new Error(err)
            }
            const fileStream = fs.createReadStream(`${path.join(dir,"candidate-test-nodejs-2021.zip")}`);
            const options = {
              method: "POST",
              url: `${config.AZ_URL}`,
              auth: {
                'user': config.AZ_USER,
                'pass': config.AZ_PASS
              },
              body: fileStream
            }
            console.log(options.url)
            const result = () => {
              return new Promise((resolve,reject) => {request.post(options, (error, response) => {
                if(error){
                  reject(error)
                }
                resolve(response)
              })})
            }
            const call = await result()
            console.log(call)
          });
       

    }catch(err){
        console.log(err)
    }
}
main()
 process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

