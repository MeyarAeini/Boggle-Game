use crate::dictionary::trie::TrieNode;
use crate::board::Board;
use std::collections::HashMap;

pub mod trie;

#[derive(Debug)]
pub struct Dictionary{
    pub root:TrieNode,
}

impl Dictionary{
    pub fn new()->Self{
        Self{
            root:TrieNode::default(),
        }
    }

    pub fn add_word(&mut self, word:&str){
        let mut node = &mut self.root;
        for ch in word.chars(){
            let index = ch.to_ascii_lowercase();
            node = node.nodes.entry(index).or_default();
        }
        node.is_word=true;
    }

    pub fn is_word(&self, word:&str)->bool{
        let mut node = &self.root;
        for ch in word.chars(){
            let index = ch.to_ascii_lowercase();
            match node.nodes.get(&index){
                Some(nd) => node = nd,
                None => return false,
            }
        }
        node.is_word
    }

    pub fn get_board_score(&mut self,brd:&Board) -> usize{         
        let mut set = HashMap::new();
        let mut visited = HashMap::new(); 

        let mut current = String::new();
        for i in 0..brd.get_x(){
            for j in 0..brd.get_y(){
                Self::get_board_score_from(&mut self.root,brd,&mut set,&mut visited,i,j,&mut current);
            }
        }

        let mut score = 0;

        for (_, val) in &set {
            score += val;
        }

        score
    }

    fn get_board_score_from(mut node:&TrieNode ,
            brd:&Board,
            set:&mut HashMap<String,usize>,
            visited:&mut HashMap<usize,bool>,
            x:usize,
            y:usize,
            current:&mut String
        ){
        
        let cell_index = x*brd.get_x() + y;
        let is_visited = visited.entry(cell_index).or_insert(false);
        //if the board's current cell is visited then return.
        if *is_visited {
            return;
        }
        
        //mark the current board's cell as visited
        *is_visited = true;
        let ch = brd.get(x,y).expect("the board must has value in all cells");
        
        //check if the trie has this node
        let ch_index = ch.to_ascii_lowercase();        
        match node.nodes.get(&ch_index){
            Some(next_node) => node = next_node,
            None => {
                //if the trie current node does not have the board's current cell's letter then revert the status and return 
                visited.insert(cell_index,false);
                return;
            },
        }
        //add current cell's letter to the current word
        current.push(ch);

        //check if the current word is a valid word in the dictionary 
        //if yes then check if it's not been added to the result set yet
        //if not added then add it to the result set with a proper calculated score
        if node.is_word && !set.contains_key(current) {                
            set.insert(current.to_string(),Self::get_score(current.len()));
        }

        //Recursively check all neighbour cells 
        for (a,b) in [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]{
            let next_x = x as i8 + a;
            let next_y = y as i8 + b;
            if (0..brd.get_x() as i8).contains(&next_x) && (0..brd.get_y() as i8).contains(&next_y){
                Self::get_board_score_from(node,brd, set, visited,next_x as usize,next_y as usize, current); 
            }           
        }

        //Remove current visited cell letter from current word end.
        current.pop();

        //mark the current cell as not visited 
        visited.insert(cell_index,false);        
    }

    fn get_score(len:usize)->usize{
        match len{
            0..=2 => 0,
            3..=4 => 1,
            5 => 2,
            6 => 3,
            7 => 5,
            _ => 11
        }
    }
}
