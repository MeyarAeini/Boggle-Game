use boggle_maker::{BoggleBuilder};
use actix_web::{get, Responder, HttpResponse};
use crate::boggle_service;

#[get("/boggle")]
async fn generate_boggle_board() -> impl Responder {
    let path = boggle_service::get_word_list_path();

    println!("dictionary file path: {path}");
    //SERSPATGLINESERS
    let builder = BoggleBuilder::new()
        .with_dictionary_path(path)
        .with_target_score(3000)
        .with_length(4)
        .with_width(4);
   
    if let Some(board) = builder.build().expect("Failed to load trie from words.txt file"){
       println!("this is a generated board by a crate publish by myself:");
       println!("{:?}", board.hash().to_ascii_uppercase());
       println!("Total score: {}", board.score().unwrap());
       HttpResponse::Ok().body(board.hash().to_ascii_uppercase())
    }
    else{
        HttpResponse::Ok().body("Failed on generating a boggle board")
    }
}