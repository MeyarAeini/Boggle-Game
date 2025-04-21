
use crate::boggle_service::BoggleService;
use serde::{Deserialize,Serialize};
use actix_web::{get, HttpRequest, web};
use std::collections::HashMap;

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
pub async fn solve_boggle_board(req: HttpRequest, data: web::Data<BoggleService>) -> web::Json<BoardResult> {
    let params = web::Query::<BoardParams>::from_query(req.query_string()).unwrap();

    let width = params.width.unwrap_or(4);
    let length = params.length.unwrap_or(4);

    if let Some(board_string) = &params.board {
        let board = board_string.chars().collect();
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