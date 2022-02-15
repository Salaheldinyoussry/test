const fs = require('fs')


// let el = document.createElement('div');
// el.id = "ttttt123"

// htmlToImage.toPng(el)
//     .then(function (dataUrl) {
        
//         var img = new Image();
//         img.src = dataUrl;
//         document.body.appendChild(img);
//         console.log(dataUrl)
//     })
//     .catch(function (error) {
//         console.error('oops, something went wrong!', error);
//     });

var puppeteer = require('puppeteer');

const con = async (html = "") => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);

    const content = await page.$("body");
    const imageBuffer = await content.screenshot({ omitBackground: true });

    await page.close();
    await browser.close();
    console.log(imageBuffer) 

    return imageBuffer;
};

con(`  
     <div style='display:flex'>
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

                                     `).then(im=>{

    const fileContents = new Buffer(im, 'base64')

      console.log ( `data:image/png;base64,${Buffer.from(fileContents).toString('base64')}`)
    fs.writeFile('test.png', fileContents, (err) => {

        if (err) return console.error(err)
        console.log('file saved to ', 'test.png')

    })
    console.log(im)
})