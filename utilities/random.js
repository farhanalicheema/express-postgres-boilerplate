var randomstring = require("randomstring");
 

module.exports.randomstr = function(){
return randomstring.generate();
}

module.exports.randomStringOfLength = function(ofLength){
return randomstring.generate(ofLength);
}

module.exports.randomLongstr = function(){
return randomstring.generate()+''+randomstring.generate()+''+randomstring.generate();
}

module.exports.random10Digits = function(){
return randomstring.generate({
  length: 10,
  charset: '0123456789'
});
}
 
console.log();