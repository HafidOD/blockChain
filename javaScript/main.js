const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, data, previousHash = ''){
        this.index = index;
        this.date = new Date(); 
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.createHash();
        this.nonce = 0;
    }

    createHash(){
        return SHA256(this.index + this.previousHash + this.data + this.date + this.nonce).toString();
    }

    mine(difficulty) {
        while(!this.hash.startsWith(difficulty)){
            this.nonce++;
            this.hash = this.createHash();
        }
    }
}

class BlockChain {
    constructor(genesis) {
        this.chain = [this.createFirstBlock(genesis)];
        this.difficulty = '0000';
    }

    createFirstBlock(genesis) {
       return new Block(0, genesis); 
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data){
        let prevBlock = this.getLastBlock();
        let block = new Block(prevBlock.index + 1, data, prevBlock.hash);
        block.mine(this.difficulty);
        console.log(`Minando ${block.hash} con nonce ${block.nonce}`);
        this.chain.push(block);
    }

    isValid() {
        for(let i = 1; i < this.chain.length; i++) {
            let prevBlock = this.chain[i - 1];
            let currBlock = this.chain[i];

            if(currBlock.previousHash != prevBlock.hash)
                return false;

            if(currBlock.createHash() != currBlock.hash)
                return false;
        }

        return true;
    }
}
/*
block = new Block(0, 'prueba');
console.log(JSON.stringify(block, null, 2));
*/

let mainCoin = new BlockChain('info genesis');
mainCoin.addBlock('agregando bloque');
mainCoin.addBlock('tranferencia de 5k pesos');
console.log(JSON.stringify(mainCoin.chain, null, 2));
//console.log(mainCoin.chain[1].nonce);

console.log(mainCoin.isValid());
mainCoin.chain[1].data = 'fake data';
console.log(mainCoin.isValid());