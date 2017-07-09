class Ghost {
  constructor(wordList = []) {
    //this.words = new Trie(wordList);
    this.playCount = 0;
  }

  *game(input) {
    let letter = null;
    while (this.playCount < 3) {
      if (this.play((letter = yield input))) {
        console.log("You played " + letter);
      } else {
        console.log(`"${letter}" is not a valid letter.`);
      }
    }
    console.log("Game over");
  }

  play(letter) {
    let isValid = this.isLetter(letter);
    if (isValid) {
      //do something
      this.playCount++;
      return true;
    } else {
      return false;
    }
  }

  computerPlay() {}

  isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }
}

module.exports = Ghost;
