var Trie = require('./trie.js');

class Ghost {
  constructor(wordList = []) {
    this.words = new Trie(wordList);
    this.prefix = "";
    this.playCount = 0;
    this.gameOver = false;
    this.cheatMode = false;
  }

  *game(input) {
    let letter = null;
    while (!this.gameOver) {
      if (this.play((letter = yield input))) {
        console.log(`You played '${letter}' making "${this.prefix}" `);
        if (!this.gameOver){
          let compPlay = this.computerPlay(this.prefix);
          if (compPlay){
            console.log(`Computer played '${compPlay}' making "${this.prefix}" `);
            if (cheatMode){
                console.log("Possible winning moves: ", this.words.matchingWords(this.prefix).filter(x => x.length > 4 && x.length % 2 === 0));
            }
          }
        }
      } else {
        console.log(`"${letter}" is not a valid letter.`);
      }
    }
    console.log("Game over");
    if (this.playerTurn = true){
        console.log(`Sorry, the computer won...`);
    }else{
      console.log("Congrats! You won!");
    }
  }

  play(letter) {
    let isValid = this.isLetter(letter);
    if (isValid && !this.gameOver) {
      this.prefix += letter;
      if (this.prefix.length > 4 && this.words.isWord(this.prefix)) this.gameOver = true;
      return true;
    } else {
      return false;
    }
  }

  computerPlay(prefix) {
    var longest = "";
    const possibleWins = this.words.matchingWords(prefix).reduce(getEvenReducer, []);
    const choice = possibleWins.length > 0 ? possibleWins[Math.floor(Math.random() * possibleWins.length)] : longest;
    let letter = choice[prefix.length];
    if (this.play(letter)){
      return letter;
    }else{
      return false;
    }
    function getEvenReducer(acc, curr){
      if (curr.length > longest.length) longest = curr;
      if (curr.length % 2 === 0 && curr.length > 4) return acc.concat(curr);
      return acc;
    }
  }

  isLetter(str) {
    return (typeof str === "string") && (str.length === 1) && (str.match(/[a-z]/i));
  }
}

module.exports = Ghost;
