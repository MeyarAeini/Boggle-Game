
use crate::board::Board;
use crate::genetic_board::GeneticBoard;

use std::time::Instant;

pub mod board;
pub mod genetic_board;
pub mod genetic_algo_board;

use word_trie::{builder,Dictionary};

fn main() {
    
    let trie = builder::TrieBuilder::new()
    .from_file("words.txt")
    .expect("Failed to load trie from file");

    crate::genetic_algo_board::run(4,4,&trie);
 

    let brd = Board::new_random(4,4);
    //dict.get_board_score(&brd);
    //dict.add_word("test");
    let _sample = Board::new(
            vec![
                vec!['S','E','R','S'],
                vec!['P','A','T','G'],
                vec!['L','I','N','E'],
                vec!['S','E','R','S']]
            ,4,4);
    //SOTGPRNSEAIESTTL
    let _sample2 = Board::new(
        vec![
            vec!['S','O','T','G'],
            vec!['P','R','N','S'],
            vec!['E','A','I','E'],
            vec!['S','T','T','L']]
        ,4,4);
    //dict.get_board_score(&sample);
    //let score = trie.get_board_score(&sample);
    //println!("score for SERSPATGLINESERS : {score}");
    //let score2 = dict.get_board_score(&sample2);
    //println!("score for SOTGPRNSEAIESTTL : {score2}");

    println!("test is a word {}",trie.is_word("test"));
    println!("read is a word {}",trie.is_word("read"));
    println!("a random boggle board: {} with hash : {}",brd.to_string(),brd.hash());
    println!("Hello, world!");
    //SERSPATGLINESERS
    let start = Instant::now();
    let hello_board = GeneticBoard::get_board(&trie, 3000, 4,4);
    let duration = start.elapsed();
    println!("hello board, genetic generated : {}, {:?}", hello_board.hash(),duration);
}
