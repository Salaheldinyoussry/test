

var cheerio = require("cheerio"),
    $ = cheerio.load(`<div> <h5 id= '113'></h5>  <h5 id= '3211'></h5>  <h5 id= '311'></h5>  </div>`);

$('h5').each(function (i, child) {
    console.log(child.attribs.id, child.tagName )
})
//console.log(arr)

//console.log($('h5').children().length)
