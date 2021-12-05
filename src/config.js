const dotenv = require("dotenv")
dotenv.config()

const config = {
    GIT_URL : process.env.GIT_URL || "bitbucket.org/myquestcoteam/candidate-test-nodejs-2021",
    GIT_USER : process.env.GIT_USER || "sangha-test-candidate2021",
    GIT_PASS : process.env.PASSWORD || "SaSNNfUkuXLKhrxRMvuv",
    AZ_URL : process.env.AZ_URL || "https://sangha-test-candidate-nodejs2021.scm.azurewebsites.net/api/zipdeploy",
    AZ_USER : process.env.AZ_USER || "sangha-test-candidate",
    AZ_PASS : process.env.AZ_PASS || "hkj87H8h^g$fh34",
    PORT : process.env.PORT || 3000
}

module.exports = config