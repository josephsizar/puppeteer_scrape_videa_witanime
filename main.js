const cheerio = require("cheerio")
const axios  = require("axios")

var url = "https://witanime.cyou/"

axios.get(url)
    .then(response =>{
        const $ = cheerio.load(response.data)

        console.log($('title').text())
    })
