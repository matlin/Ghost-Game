const Ghost = require("./ghost.js");
var fs = require("fs");
var readline = require("readline");

/* Load word list */
console.log("Loading word dictionary...");
const words = fs.readFileSync("word_list.txt", "utf8").split(/\s/).filter(word => word.length >= 4);
console.log("Loaded " + words.length + " words.");

/* Prepare console input */
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

/* Start game */
let cheatsOn = process.env.CHEAT && process.env.CHEAT.toLowerCase() === "true";
const ghost = new Ghost(words, cheatsOn);
let game = ghost.game();
game.next();
/* allow interacting with game */
rl.on("line", function(line) {
  let done = game.next(line).done;
  if (done){
    process.exit();
  }
});
