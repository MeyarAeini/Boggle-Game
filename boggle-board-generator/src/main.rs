use actix_web::{App, HttpServer, web};


pub mod boggle_service;
pub mod boggle_solver_service;
pub mod boggle_generate_service;
use crate::boggle_service::BoggleService;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server running at http://localhost:1729");

    HttpServer::new(|| {
        App::new()
            .app_data(web::Data::new(BoggleService::new()))
            .service(boggle_generate_service::generate_boggle_board)
            .service(boggle_solver_service::solve_boggle_board)
    })
    .bind(("0.0.0.0", 1729))?  // 0.0.0.0 allows external access
    .run()
    .await
}
