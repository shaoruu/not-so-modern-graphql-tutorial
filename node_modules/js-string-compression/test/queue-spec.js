var expect = require("chai").expect;
var jsscompress = require("../src/jsscompress");

describe("Queue operation", function(){
   it("should enqueue and dequeue correctly", function(){
       var queue = new jsscompress.Queue();
       queue.enqueue("one");
       queue.enqueue("two");
       expect(queue.size()).to.equal(2);
       expect(queue.isEmpty()).to.equal(false);
       expect(queue.dequeue()).to.equal("one");
       expect(queue.size()).to.equal(1);
       expect(queue.dequeue()).to.equal("two");
       expect(queue.size()).to.equal(0);
       expect(queue.isEmpty()).to.equal(true);
   });
});