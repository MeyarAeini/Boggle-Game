use boggle_maker::BoggleBuilder;
use actix_web::{get, App, HttpServer, Responder, HttpResponse};

#[get("/boggle")]
async fn hello() -> impl Responder {
    let path = std::env::var("WORDS_PATH").unwrap_or("words.txt".to_string());

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

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server running at http://localhost:1729");

    HttpServer::new(|| {
        App::new()
            .service(hello)
    })
    .bind(("0.0.0.0", 1729))?  // 0.0.0.0 allows external access
    .run()
    .await
}
