
use crate::genetic_board::GeneticBoard;

use std::time::Instant;

pub mod board;
pub mod genetic_board;
pub mod genetic_algo_board;

use word_trie::builder;
use boggle_maker::BoggleBuilder;
use boggle_maker::Board;

fn main() {
    
    // let trie = builder::TrieBuilder::new()
    // .from_file("words.txt")
    // .expect("Failed to load trie from file");

    // let start = Instant::now();
    // crate::genetic_algo_board::run(4,4,&trie);
    // let duration = start.elapsed();
    // println!("genetic algorithm took : {:?}",duration);

    //SERSPATGLINESERS
    let builder = BoggleBuilder::new()
    .with_dictionary_path("words.txt")
    .with_target_score(3000)
    .with_length(4)
    .with_width(4);
   
    if let Some(board) = builder.build().expect("Failed to load trie from words.txt file"){
       println!("this is a generated board by a crate publish by myself {:?} with score of {}", board.to_string(),board.score().unwrap());
    }

    // let start = Instant::now();
    // let hello_board = GeneticBoard::get_board(&trie, 3000, 4,4);
    // let duration = start.elapsed();
    // println!("hello board, genetic generated : {}, {:?}", hello_board.hash(),duration);
}
