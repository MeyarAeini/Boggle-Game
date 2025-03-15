use crate::dictionary::trie::TrieNode;
use crate::board::Board;
use std::collections::HashMap;

pub mod trie;

pub struct Dictionary{
    root:TrieNode,
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
            //if Self::is_valid(&ch) {
                let index = ch.to_ascii_lowercase();//Self::get_index(&ch);
                node = node.nodes.entry(index).or_default();
                // if node.nodes[index].is_none() {
                //     node.nodes[index] = Some(Box::new(TrieNode::new()));
                // }
                //node = node.nodes[index].as_mut().unwrap();
            //}
        }
        node.is_word=true;
    }

    pub fn is_word(&self, word:&str)->bool{
        let mut node = &self.root;
        for ch in word.chars(){
            //if Self::is_valid(&ch) {
                let index = ch.to_ascii_lowercase();
                match node.nodes.get(&index){
                    Some(nd) => node = nd,
                    None => return false,
                }
                //let index = ch.to_ascii_lowercase();//Self::get_index(&ch);
                // if node.nodes[index].is_none() {
                //     return false;
                // }
                // node = node.nodes[index].as_mut().unwrap();
            //}
        }
        node.is_word
    }

    pub fn get_board_score(&mut self,brd:&Board) -> usize{         
        let mut set = HashMap::new();
        let mut visited = HashMap::new(); 

        let mut current = String::new();
        //println!("{0:#?}",self.root);
        for i in 0..brd.get_x(){
            for j in 0..brd.get_y(){
                //println!("({i},{j})");
                Self::get_board_score_from(&mut self.root,brd,&mut set,&mut visited,i,j,&mut current);
            }
        }

        let mut score = 0;

        for (key, val) in &set {
            score += val;
            println!("{key}:{val}");
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
           // println!("-----({x},{y})");
        let cell_index = x*brd.get_x() + y;
        let is_visited = visited.entry(cell_index).or_insert(false);
        if *is_visited {
            return;
        }
        
        *is_visited = true;
        let ch = brd.get(x,y).expect("the board must has value in all cells");
        
        //check if the trie has this node
        let ch_index = ch.to_ascii_lowercase();
        let prev_node = node;
        match node.nodes.get(&ch_index){
            Some(next_node) => node = next_node,
            None => {
                visited.insert(cell_index,false);
                return;
            },
        }

        current.push(ch);
        //println!("call for {current}");
        if node.is_word && !set.contains_key(current) {                
            set.insert(current.to_string(),Self::get_score(current.len()));
        }

        //step into 
        for (a,b) in [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]{
            let next_x = x as i8 + a;
            let next_y = y as i8 + b;
            if (0..brd.get_x() as i8).contains(&next_x) && (0..brd.get_y() as i8).contains(&next_y){
                Self::get_board_score_from(node,brd, set, visited,next_x as usize,next_y as usize, current); 
            }           
        }
        current.pop();
        
        node = prev_node;
        visited.insert(cell_index,false);        
    }

    fn get_index( ch:&char)->usize{
        (*ch).to_ascii_lowercase() as usize - 'a' as usize
    }

    fn is_valid(ch:&char)->bool{
        (*ch).is_ascii_alphabetic()
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
