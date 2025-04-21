use boggle_maker::{BoggleBuilder, BoggleBoardSolver};
use actix_web::{get, App, HttpServer, Responder, HttpResponse, HttpRequest, web};
use serde::{Deserialize,Serialize};
use std::collections::HashMap;
use boggle_maker::boggle_board_solver::BoggleBoardResult;

#[get("/boggle")]
async fn generate_boggle_board() -> impl Responder {
    let path = get_word_list_path();

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

#[derive(Deserialize)]
struct BoardParams {
    width: Option<usize>,
    length: Option<usize>,
    board: Option<String>,
}

#[derive(Serialize, Default)]
struct BoardResult {
    value: Option<String>,
    scores: Option<HashMap<usize,u32>>,
    error: Option<String>,
}

impl BoardResult {
    pub fn error(err: &str) -> Self{
        let mut result = Self::default();
        result.error = Some(err.to_string());

        result
    }

    pub fn value(val: String) -> Self{
        let mut result = Self::default();
        result.value = Some(val);
        result.scores = Some(HashMap::new());
        
        result
    }

    pub fn set(&mut self, score: usize, value: u32) {
        if let Some(scores) = &mut self.scores {
            scores.insert(score, value);
        }
    }
}

#[get("/solve")]
async fn solve_boggle_board(req: HttpRequest, data: web::Data<BoggleAppState>) -> web::Json<BoardResult> {
    let params = web::Query::<BoardParams>::from_query(req.query_string()).unwrap();

    let width = params.width.unwrap_or(4);
    let length = params.length.unwrap_or(4);

    if let Some(board_string) = &params.board {
        let board = get_board_vec(&board_string);
        let solution = data.solve(&board, width, length);

        return match solution {
            Some(board_result) => {
                let mut response = BoardResult::value(board_string.clone());

                for score in vec![1,2,3,5,11].iter() {
                    response.set(*score,board_result.how_many(*score));
                }        

                web::Json(response)
            },

            None => web::Json(BoardResult::error("Failed on solve a boggle board")),
        }
    }

    web::Json(BoardResult::error("Failed on solve a boggle board"))
    
}

fn get_word_list_path() -> String {
    std::env::var("WORDS_PATH").unwrap_or("words.txt".to_string())
}

fn get_board_vec(board: &str) -> Vec<char> {
    board.chars().collect()
}

// This struct represents state
struct BoggleAppState(Option<BoggleBoardSolver>);

impl BoggleAppState {
    pub fn solve(&self, board: &Vec<char>, width: usize, length: usize) -> Option<BoggleBoardResult> {

        match &self.0 {
            Some(solver) => solver.solve_vec(board, width, length),
            None => None,
        }
    }
}

fn get_solver_app_state() -> BoggleAppState {
    let path = get_word_list_path();
    let solver = BoggleBoardSolver::new()
            .with_dictionary(path);

    match solver {
        Ok(service) => BoggleAppState(Some(service)),
        Err(_) => BoggleAppState(None),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server running at http://localhost:1729");

    HttpServer::new(|| {
        App::new()
            .app_data(web::Data::new(get_solver_app_state()))
            .service(generate_boggle_board)
            .service(solve_boggle_board)
    })
    .bind(("0.0.0.0", 1729))?  // 0.0.0.0 allows external access
    .run()
    .await
}
