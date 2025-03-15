
use crate::dictionary::Dictionary;
use crate::board::Board;

use std::fs::File;
use std::io::{self,BufRead};

pub mod dictionary;
pub mod board;

fn main() {
    let mut dict = Dictionary::new();

    match read_words(){
        Ok(lines)=>{
            for line in lines {
                dict.add_word(&line);
            }
        },
        Err(err)=> eprintln!("error reading file : {}",err),
    }

    let brd = Board::new_random(4,4);
    //dict.get_board_score(&brd);
    //dict.add_word("test");
    let sample = Board::new(
            vec![
                vec!['S','E','R','S'],
                vec!['P','A','T','G'],
                vec!['L','I','N','E'],
                vec!['S','E','R','S']]
            ,4,4);
    //SOTGPRNSEAIESTTL
    let sample2 = Board::new(
        vec![
            vec!['S','O','T','G'],
            vec!['P','R','N','S'],
            vec!['E','A','I','E'],
            vec!['S','T','T','L']]
        ,4,4);
    //dict.get_board_score(&sample);
    let score = dict.get_board_score(&sample2);
    println!("score for SOTGPRNSEAIESTTL : {score}");
    println!("test is a word {}",dict.is_word("test"));
    println!("read is a word {}",dict.is_word("read"));
    println!("a random boggle board: {} with hash : {}",brd.to_string(),brd.hash());
    println!("Hello, world!");
    //SERSPATGLINESERS
}

fn read_words() -> io::Result<Vec<String>> {
    let file = File::open("words.txt")?;
    let reader = io::BufReader::new(file);
    let lines: Vec<String> = reader.lines().collect::<Result<_, _>>()?;
    Ok(lines)
}
