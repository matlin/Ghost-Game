class Node {
  constructor(letter = "") {
    this.letter = letter;
    this.children = {};
    this.isWord = false;
  }
}

class Trie {
  constructor(words = []) {
    this.root = new Node();
    for (let word of words) {
      this.add(word);
    }
  }

  add(str, root = this.root) {
    if (str.length === 0) {
      root.isWord = true;
    } else {
      const next = root.children[str[0]] || new Node(str[0]);
      root.children[str[0]] = next;
      this.add(str.slice(1), next);
    }
  }

  getPrefixNode(str, root=this.root){
    if (str.length === 0){return root;}
    if (root.children[str[0]]){
      return this.getPrefixNode(str.slice(1), root.children[str[0]]);
    }
    return null;
  }

  matchingWords(str, root = this.root, prefix = "", acc = []) {
    if (str.length === 0) {
      let newEntry = root.isWord ? [prefix] : [];
      let children = Object.keys(root.children).map(key => {
        return this.matchingWords("", root.children[key], prefix + key, acc);
      });
      return newEntry.concat(...children);
    } else {
      if (root.children[str[0]])
        return this.matchingWords(
          str.slice(1),
          root.children[str[0]],
          prefix + str[0],
          acc
        );
      return [];
    }
  }

  getWinningPercentage(root = this.root, turn) {
    //base case
    if (root.isWord) {
      return !turn ? 1 : 0; //who won at that letter
    }
    const children = Object.keys(root.children).map(letter =>
      this.getWinningPercentage(root.children[letter], !turn)
    );
    if (!turn) {
      //next choice is yours so make best choice
      return Math.max(...children);
    } else {
      //next choice is theirs so average percentage chance of winning
      return children.reduce((acc, curr) => acc + curr) / children.length;
      //return Math.min(...children); //if you were playing against optimized player
    }
  }

  getLongestUniqueWord(root=this.root, prefix=""){
    if (root.isWord){return (prefix + root.letter)}
    return Object.values(root.children).reduce((longest, node) => {
      let bestChild = this.getLongestUniqueWord(node, prefix + root.letter);
      return bestChild.length > longest.length ? bestChild : longest;
    }, "");
  }

  isValidPrefix(str, root = this.root) {
    if (str.length === 0) return true;
    if (root.children[str[0]])
      return this.isValidPrefix(str.slice(1), root.children[str[0]]);
    return false;
  }

  isWord(str, root = this.root) {
    if (str.length === 0) return root.isWord;
    if (root.children[str[0]])
      return this.isWord(str.slice(1), root.children[str[0]]);
    return false;
  }
}

module.exports = Trie;
