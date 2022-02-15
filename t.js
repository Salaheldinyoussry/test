// const cheerio = require("cheerio");

// let html = `
// <html>

// <head></head>

// </body>
// <div class='dd'>

// <div>

// <img src='hey'/>


// <a></a>
// </div>




// </div>

// </body>

// </html>

// `
// // let parseContent = cheerio.load(html)

// // let imageUrl = parseContent('img').attr('href')

// // parseContent('img').wrap(`<a href='${imageUrl}'></a>`)

// // return cb(parseContent.html())

// let parseContent = cheerio.load(html)
// //console.log(parseContent.html())


// //let id = parseContent('img').parent().replaceWith('<h4></h4>')
// // console.log("F:",id)

// // parseContent(`#${id}`)

// console.log(parseContent('img').parent().data())



const nodeHtmlToImage = require('node-html-to-image')

nodeHtmlToImage({
    output: './image.png',
    html: `<html>
    <head>
    <body>
     <div id='contall'>
                                    

                                      <a style="
                                                z-index: 100000;
                                                position: absolute;
                                                margin : 20px;
                                                margin-Top:50px;
                                                color: black;
                                                font-size:38;
                                                 font-family: Arial;
                                                 width:90%;
                                            ">INSERT TITLE HERE</a>


                                      <a style="
                                                z-index: 100000;
                                                position: absolute;
                                                margin : 20px;
                                                margin-Top:120px;
                                                color: black;
                                                font-size:28;
                                                font-family: Arial;
                                                width:90%;
                                            ">INSERT SUBTITLE HERE</a>

                                      <a style="
                                                z-index: 100000;
                                                position: absolute;
                                                margin : 20px;
                                                margin-Top:170px;
                                                color: black;
                                                font-size:20;
                                                width:90%;
                                                height:200px;
                                                
                                            ">INSERT DESCRIPTION HERE</a>

                                     </div>

      <style>
        body {
          height: 500px;
        }
        #contall{
      background-image: url("https://via.placeholder.com/150"); /* The image used */
  height: 500px; /* You must set a specified height */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover;

        }
      </style>
    </head>
    </body>
  </html>
  `
    /*
    `  
        < div style='display:flex' >
                                     <img style="height:500px; width:100%;" class='img-extended' src= 'https://via.placeholder.com/150'  >
                                     </img>

                                      <a style="
                                                z-index: 100000;
                                                position: absolute;
                                                margin : 20px;
                                                margin-Top:50px;
                                                color: black;
                                                font-size:38;
                                                 font-family: Arial;
                                                 width:90%;
                                            ">INSERT TITLE HERE</a>


                                      <a style="
                                                z-index: 100000;
                                                position: absolute;
                                                margin : 20px;
                                                margin-Top:120px;
                                                color: black;
                                                font-size:28;
                                                font-family: Arial;
                                                width:90%;
                                            ">INSERT SUBTITLE HERE</a>

                                      <a style="
                                                z-index: 100000;
                                                position: absolute;
                                                margin : 20px;
                                                margin-Top:170px;
                                                color: black;
                                                font-size:20;
                                                width:90%;
                                                height:200px;
                                                
                                            ">INSERT DESCRIPTION HERE</a>

                                     </div>

                                     `*/
})
    .then(() => console.log('The image was created successfully!'))