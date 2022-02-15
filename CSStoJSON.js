 const  CSStoJSON = (s)=>{
     s = s.replaceAll(/\s/g, '')
 let fbrack = false;
 
 let tempJson = {}

 let curr =''
 let currText ='' 
 for(var i=0; i<s.length; i++){
     let c = s.charAt(i)
     if(c=='{'){
        fbrack= true         
     }else if (c=='}'){
         tempJson[curr] = currText
         curr = ''
         currText=''
         fbrack = false
     }
     else{

         if (!fbrack) {
             curr +=c;
         }
         else {
             currText+=c;
         }

     }
 }

 let json ={}
 
Object.entries(tempJson).map(([key, value]) =>{
    if(value){
        let obj ={}
        
        let entries = value.split(';')

        entries.forEach(e=>{
        if(e){
            let t = e.split(':')
            obj[t[0]] = t[1];
        }
        })

        json[key]=obj
   }

})



     return json
}


// console.log(CSStoJSON(`* { box-sizing: border-box; } 


//   .title {
// z-index:100;position:absolute;margin:20px;margin-Top:50px;color:black;font-size:48;font-family:Arial;width:90%;  }
//   .subtitle {
// z-index:100;position:absolute;margin:20px;margin-Top:120px;color:black;font-size:38;font-family:Arial;width:90%;  }
//     .desc {
// z-index:100;position:absolute;margin:20px;margin-Top:170px;color:black;font-size:30;width:90%;height:200px;  }

// @media only screen and (max-width: 1200px) {
//   .title {
//     font-size: min(38px , 38px);
//   }
//   .subtitle {
//      font-size: min(38px , 22px);
//   }
//     .desc {
//      font-size: min(38px , 18px);
//   }
// }

// @media only screen and (max-width: 600px) {
//   .title {
//     font-size: min( 38px , 18px);
//   }
//   .subtitle {
//      font-size: min(38px , 12px);
//   }
//  .desc {
//      font-size: min(38px , 8px);
//   }
// }








// body {margin: 0;}

// #i91z{padding:10px;}

// #iij1{display:flex;}

// #i5sp{height:500px;width:100%;}

// #iwib7{padding:10px;}`))



const cssJsonToString = (obj)=>{
    let str= ''
    Object.entries(obj).map(([key, value]) => {
        let t =''
        Object.entries(value).map(([k, v]) => {
           t+=''+k+':'+v+';';
        }) 

        str+=""+key+'{'+t+'}'

    })   
    return str
}

console.log(cssJsonToString(
    {
    '*': { 'box-sizing': 'border-box' } 



}   ))