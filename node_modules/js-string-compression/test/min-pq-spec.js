var expect = require("chai").expect;
var jsscompress = require("../src/jsscompress");

describe("MinPQ", function(){
   it("add and delete min successfully", function() {
       var pq = new jsscompress.MinPQ(function(a1, a2){
           return a1 - a2;
       });
       
       pq.enqueue(100);
       pq.enqueue(90);
       pq.enqueue(98);
       pq.enqueue(89);
       
       expect(pq.size()).to.equal(4);
       expect(pq.isEmpty()).to.equal(false);
       expect(pq.delMin()).to.equal(89);
       expect(pq.delMin()).to.equal(90);
       expect(pq.delMin()).to.equal(98);
       expect(pq.delMin()).to.equal(100);
       expect(pq.isEmpty()).to.equal(true);
   }) ;
});