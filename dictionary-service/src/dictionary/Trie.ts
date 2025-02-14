export class TrieNode{
    children:{[key:string]:TrieNode};
    isword:boolean;
    constructor(){
        this.children={};
        this.isword=false;
    }
}

export class Trie{
    root:TrieNode;

    constructor(){
        this.root = new TrieNode();
    }

    insert(word:string):void{
        let node = this.root;
        for(const ch of word){            
            if(!node.children[ch])
                node.children[ch] = new TrieNode();
            node = node.children[ch];
        }
        node.isword=true;
    }

    search(word:string):boolean{
        let node = this.root;
        console.log(`search for ${word}`);
        for(const ch of word){
            const upperCh = ch.toUpperCase();
            if(!node.children[upperCh])
                return false;
            node = node.children[upperCh];
        }
        return node.isword;
    }
}