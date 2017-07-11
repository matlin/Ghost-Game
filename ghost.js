var Trie = require("./trie.js");

class Ghost {
  constructor(wordList = [], cheatMode = false) {
    this.words = new Trie(wordList);
    this.prefix = "";
    this.playCount = 0;
    this.gameOver = false;
    this.cheatMode = cheatMode;
    this.playerTurn = true;
    if (this.cheatMode) {
      console.log("Cheat mode active.");
    }
  }

  *game(input) {
    let letter = null;
    console.log("You go first. Enter a letter to start the game!");
    while (!this.gameOver) {
      if (this.cheatMode) {
        console.log("You should play: " + this.bestChoice());
      }
      letter = yield input;
      if (letter.toLowerCase() === "quit") {
        this.gameOver = true;
        this.playerTurn = false;
        break;
      }
      if (this.play(letter)) {
        console.log(`You played '${letter}' making "${this.prefix}" `);
        this.playerTurn = false;
        if (!this.gameOver) {
          let compPlay = this.computerPlay(this.prefix);
          if (compPlay) {
            this.playerTurn = true;
            if (this.cheatMode) {
              console.log(
                "Possible winning moves (careful some have prefixes that may cause you to lose): ",
                this.words
                  .matchingWords(this.prefix)
                  .filter(x => x.length >= 4 && x.length % 2 === 0)
              );
            }
            console.log(
              `Computer played '${compPlay}' making "${this.prefix}" `
            );
          }
        }
      } else {
        console.log(`"${letter}" is not a valid play. Try again.`);
      }
    }
    if (this.playerTurn !== true) {
      if (this.words.isWord(this.prefix)) {
        console.log(`You spelled the word "${this.prefix}"`);
      } else {
        console.log(`"${this.prefix} is not a prefix to a word.`);
      }
      console.log(`Sorry, the computer won...`);
    } else {
      console.log("Congrats! You won!");
    }
    console.log("Game over.");
  }

  play(letter) {
    let isValid = this.isLetter(letter);
    if (isValid && !this.gameOver) {
      this.prefix += letter;
      if (
        this.prefix.length >= 4 &&
        (!this.words.isValidPrefix(this.prefix) ||
          this.words.isWord(this.prefix))
      ) {
        this.gameOver = true;
      }
      return true;
    } else {
      return false;
    }
  }

  bestChoice() {
    let bestChance = 0;
    let options = {};
    let currNode = this.words.getPrefixNode(this.prefix);
    for (let char in currNode.children) {
      options[char] = this.words.getWinningPercentage(
        currNode.children[char],
        true
      );
      if (options[char] > bestChance) bestChance = options[char];
    }
    const bestOptions = Object.entries(options).filter(
      ([char, score]) => score === bestChance
    );
    if (this.cheatMode && this.playerTurn) {
      console.log(options);
    }
    if (bestOptions.length > 0) {
      /*if (bestChance === 0){
        const longestWord = this.words.getLongestUniqueWord(currNode, this.prefix.slice(0,-1));
        console.log("longest word: " + longestWord);
        const letter = longestWord[[this.prefix.length]]
        return letter;
      }*/
      const letter =
        bestOptions[Math.floor(Math.random() * bestOptions.length)][0];
      return letter;
    } else {
      return null;
    }
  }

  computerPlay(prefix) {
    var longest = "";
    /*const possibleWins = this.words
      .matchingWords(prefix)
      .reduce(getEvenReducer, []);
      let bestChance = 0;
      let options = {};
      let currNode = this.words.getPrefixNode(this.prefix);
      for (let char in currNode.children){
        options[char] = this.words.getWinningPercentage(currNode.children[char], true);
        if (options[char] > bestChance) bestChance = options[char];
      }
      console.log(options);
      const bestOptions = Object.entries(options).filter(([char, score]) => score === bestChance);
      const letter = bestOptions[Math.floor(Math.random() * bestOptions.length)][0];*/
    /*const choice = possibleWins.length > 0
      ? possibleWins[Math.floor(Math.random() * possibleWins.length)]
      : longest;
    if (this.cheatMode) {console.log(`Computer is thinking of "${choice}"`)}
    let letter = choice[prefix.length];*/
    const letter = this.bestChoice();
    if (this.play(letter)) {
      return letter;
    } else {
      return false;
    }
    function getEvenReducer(acc, curr) {
      if (curr.length > longest.length) longest = curr;
      if (curr.length % 2 === 1 && curr.length >= 4) return acc.concat(curr);
      return acc;
    }
  }

  isLetter(str) {
    return typeof str === "string" && str.length === 1 && str.match(/[a-z]/i);
  }
}

module.exports = Ghost;
