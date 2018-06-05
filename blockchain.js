const SHA256 = require('crypto-js/sha256');

class Block {


  /*index: where block sits on chain
  timestamp: when block created
  data: details of transaction (how much money transferred, who was sender/reciever)
  previousHash: string that contains hash of block before current one. Ensures integrity of blockchain. 
  ***Hash means digital signiture***
  */

    constructor(index, timeStamp, data, previousHash= '') {

    this.index=index;
    this.timeStamp= timeStamp;
    this.data= data;
    this.previousHash= previousHash;
    this.currentHash= this.calculateHash();

    //random number that can be changed to something random
    this.nonce= 0;

    }

  calculateHash() {

    //creates current hash of block
    //JSON.stringify <-- converts to JSON String
    return SHA256(this.index + this.previousHash + this.timeStamp + JSON.stringify(this.data) + this.nonce).toString();

  }

  /* less time to mine new block, difficulty increase
  try to make current hash of block begin with certain amount of zeros. 
  ex.) if difficulty set to 5, takes first 5 characters of hash and keep running 
  as long as first 5 characters of hash is not equal to all zeros. 

  */

  mineBlock(difficulty){
    while(this.currentHash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){

      //increment as long as hash doesn't start with enough zeros
      this.nonce++;
      this.currentHash= this.calculateHash();

    }

    //hash of block won't change unless we change content of block
    //so we need some content to change
    console.log("Block mined: " + this.currentHash);
  }

}

  class Blockchain{

    constructor(){
      //array of blocks
      //initializes it with the genesisblock
      this.chain= [this.Genesisblock()];
      //control how fast new blocks can be added to blockchain
      this.difficulty= 2;

    }

    Genesisblock(){
      return new Block (0, "01/01/2018", "Genesis block", "0" );

    }

    getLatestBlock(){
      //gets last block of chain
      return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){

      //adds new block to chain
      //set previoushash of newblock to current hash of latest block
      newBlock.previousHash= this.getLatestBlock().currentHash;
      newBlock.mineBlock(this.difficulty);
      this.chain.push(newBlock);

    }

    isChainValid(){
      for(let i =1; i<this.chain.length; i++){
        
        const currentBlock= this.chain[i];
        const previousBlock= this.chain[i-1];

        if(currentBlock.currentHash !== currentBlock.calculateHash()){
          return false;
        }
        if(currentBlock.previousHash !== previousBlock.currentHash){
          return false;
        }

      }
      return true;

    }
  
  }

  //create new blockchain
  let momocoin= new Blockchain();
  
  console.log('Mining block 1... ');
  momocoin.addBlock(new Block(1, "08/07/2018", {amount: 4}));

  console.log('Mining block 2... ');
  momocoin.addBlock(new Block(2, "12/09/2018", {amount: 10}));





  //console.log('Is this blockchain valid? ' + momocoin.isChainValid());
  //momocoin.chain[1].data= {amount: 100};
  //momocoin.chain[1].currentHash= momocoin.chain[1].calculateHash();
  //console.log('Is this blockchain valid? ' + momocoin.isChainValid());
  //console.log(JSON.stringify(momocoin, null, 4));
  