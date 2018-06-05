const SHA256 = require('crypto-js/sha256');

class Transaction{

    constructor(fromAddress, toAddress, amount){
        this.fromAddress=fromAddress;
        this.toAddress= toAddress;
        this.amount= amount;
    }

}


class Block {


  /*index: where block sits on chain
  timestamp: when block created
  data: details of transaction (how much money transferred, who was sender/reciever)
  previousHash: string that contains hash of block before current one. Ensures integrity of blockchain. 
  ***Hash means digital signiture***
  */

    constructor(timeStamp, transactions, previousHash= '') {
    this.timeStamp= timeStamp;
    this.transactions= transactions;
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
      this.pendingTransactions= [];
      this.miningRewards= 100;

    }

    Genesisblock(){
      return new Block ("01/01/2018", "Genesis block", "0" );

    }

    getLatestBlock(){
      //gets last block of chain
      return this.chain[this.chain.length-1];
    }

    //in reality, minors have to pick transactions that they want to include 
    minePendingTransactions(miningRewardAddress){

        let block= new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().currentHash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!')
        this.chain.push(block);

        this.pendingTransactions= [new Transaction(null, miningRewardAddress, this.miningRewards)];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }


    getBalanceOfAddress(address){
        let balance=0;

        for (const block of this.chain){
            for(const trans of block.transactions){

                if(trans.fromAddress===address){
                    balance-+trans.amount;

                }

                if(trans.toAddress===address){
                    balance+= trans.amount;
                }
            }
        }

        return balance;
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

  momocoin.createTransaction(new Transaction('address1', 'address2', 100));
  momocoin.createTransaction(new Transaction('address2', 'address1', 50));

  console.log('\n Starting the miner...');
  momocoin.minePendingTransactions('mauliks-address');
  console.log('\n Balance of maulik is', momocoin.getBalanceOfAddress('mauliks-address'));

  console.log('\n Starting the miner once more...');
  momocoin.minePendingTransactions('mauliks-address');
  console.log('\n Balance of maulik is', momocoin.getBalanceOfAddress('mauliks-address'));

 