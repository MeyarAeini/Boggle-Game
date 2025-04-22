use boggle_maker::{BoggleBoardSolver};
use boggle_maker::boggle_board_solver::BoggleBoardResult;

pub struct BoggleService(Option<BoggleBoardSolver>);

impl BoggleService {
    pub fn new() -> Self {
        let path = get_word_list_path();
        let solver = BoggleBoardSolver::new()
                .with_dictionary(path);

        match solver {
            Ok(service) => Self(Some(service)),
            Err(_) => Self(None),
        }
    }

    pub fn solve(&self, board: &Vec<char>, width: usize, length: usize) -> Option<BoggleBoardResult> {
        match &self.0 {
            Some(solver) => solver.solve_vec(board, width, length),
            None => None,
        }
    }
}

pub fn get_word_list_path() -> String {
    std::env::var("WORDS_PATH").unwrap_or("words.txt".to_string())
}