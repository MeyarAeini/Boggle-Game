use boggle_maker::BoggleBuilder;

fn main() {

    //SERSPATGLINESERS
    let builder = BoggleBuilder::new()
    .with_dictionary_path("words.txt")
    .with_target_score(3000)
    .with_length(4)
    .with_width(4);
   
    if let Some(board) = builder.build().expect("Failed to load trie from words.txt file"){
       println!("this is a generated board by a crate publish by myself:");
       println!("{:?}", board.hash().to_ascii_uppercase());
       println!("Total score: {}", board.score().unwrap());
    }
}
