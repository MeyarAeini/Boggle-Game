use std::collections::HashMap;

#[derive(Default,Debug)]
pub struct TrieNode{
    pub nodes:HashMap<char, TrieNode>,
    pub is_word:bool,
}

// impl TrieNode{
//     pub fn new()->Self{
//         Self{
//             nodes:Default::default(),
//             is_word:false,
//         }
//     }
// }