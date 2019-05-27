var expect = require("chai").expect;
var jsscompress = require("../src/jsscompress");

describe("Hauffman algorithm", function(){
   it("should read and write trie correctly", function(){
      var text = "Hello World";
       var hm = new jsscompress.Hauffman();
       var trie = hm.buildTrie(text);
       var code = {};
       hm.buildCode(trie, "", code);
       for(var cc in code){
           console.log(String.fromCharCode(cc) + ": " + code[cc]);
       }
       var bitStream = new jsscompress.Queue();
       hm.writeTrie(trie, bitStream);
       var trie2 = hm.readTrie(bitStream);
       var code2 = {};
       hm.buildCode(trie2, "", code2);
       for(var cc in code2) {
           console.log(String.fromCharCode(cc) + ": " + code2[cc]);
           expect(cc in code).to.equal(true);
           expect(code[cc]).to.equal(code2[cc]);
       }
       
       text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
       bitStream = hm.compressToBinary(text);
       
       var text2 = hm.decompressFromBinary(bitStream);
       console.log(text2);
       expect(text2).to.equal(text);
       
       var compressed = hm.compress(text);
       console.log(compressed);
       
       var decompressed = hm.decompress(compressed);
       console.log(decompressed);
       
       expect(decompressed).to.equal(text);
   }); 
});