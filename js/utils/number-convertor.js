function isNumber(str) {
    var pattern = /^\d+$/;
    return pattern.test(str);  
}

function getNumberArrayFrom(aString){
    let ret = [];

    if(aString===undefined || aString===null){
      return ret;
    }

    let trimmed = aString.trim();
    if(trimmed.length===0){
      return ret;
    }

    let notnumbers = /[^0-9]/gi;
    let toParse = trimmed.replace(notnumbers, ' ');
    toParse = toParse.trim();

    let parsed = toParse.split(" ");

    for(const item of parsed){
      if(item===undefined || item===null || item.trim().length===0){
        // ignore it
      }else{

        if(isNumber(item)){
            const parsedNum = parseInt(item);
            if (!isNaN(parsedNum)) {
              ret.push(parsedNum)
            }    
        }
      }
    }

    return ret;
}

export {getNumberArrayFrom}