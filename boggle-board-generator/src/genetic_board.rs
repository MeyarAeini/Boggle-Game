use crate::board::Board;
use crate::dictionary::Dictionary;
use rand::Rng;
use rand::distr::{Distribution, Uniform};
use std::collections::HashSet;

pub struct GeneticBoard{
    board:Board,
    age:u32,
    score:usize,
}

impl GeneticBoard{
    pub fn get_board(dictionary:&mut Dictionary, minimum_score:usize, board_x:usize,board_y:usize)->Board{
        const POPULATION_SIZE:usize = 10;
        let mut choromosomes : Vec<GeneticBoard> = Self::init_population(dictionary,POPULATION_SIZE, board_x, board_y);

        let mut generation = 0;
        loop{
            
            //stop mating if the minimum requiremet is met.
            if let Some(x) = choromosomes.first() {
                println!("hello board, genetic generated : {} : {} : {}", x.board.hash(),x.age,x.score);
                if x.score > minimum_score || generation>20 {
                    return x.board.copy();
                }
            }

            choromosomes = Self::evolve_population(dictionary,POPULATION_SIZE,&choromosomes);
            generation+=1;
        }

    }

    // fn tournament_select(choromosomes : &Vec<GeneticBoard>, uniform: &Uniform<u32>, rng: &mut impl Rng)->usize{
    //     let mut a = uniform.sample(&mut rng);
    //     for i in 0..4 {
    //         let b = uniform.sample(&mut rng);
    //         if choromosomes[b].score > choromosomes[a].score {
    //             a = b;
    //         }
    //     }
    //     return a;
    // }
    fn evolve_population(dictionary:&mut Dictionary,size:usize, prev_generation : &Vec<GeneticBoard>) -> Vec<GeneticBoard>{
        let mut choromosomes : Vec<GeneticBoard> = Vec::new();
        let new_borns : HashSet<String> = HashSet::new();
        let uniform = Uniform::try_from(0..size).unwrap();
        let mut rng = rand::rng();
        while choromosomes.len() < size*10 {            
            let mut a = 0;
            {
                a = uniform.sample(&mut rng);
                for i in 0..1 {
                    let c = uniform.sample(&mut rng);
                    if prev_generation[c].score > prev_generation[a].score {
                        a = c;
                    }
                }
            }
            let mut b = a;
            while b==a {
                b = uniform.sample(&mut rng);
                for i in 0..1 {
                    let c = uniform.sample(&mut rng);
                    if prev_generation[c].score > prev_generation[b].score {
                        b = c;
                    }
                }
            }

            //let b = Self::tournament_select(prev_generation, &between,&mut rng);
            let mut born = prev_generation[a].merge(&prev_generation[b]);
            let key = born.board.hash();
            if new_borns.contains(&key) {
                continue;
            }
            born.score = dictionary.get_board_score(&born.board);
            choromosomes.push(born);
        }
        for i in 0..1 {
            if let Some(x) = prev_generation.get(i) {
                let key = x.board.hash();
                if !new_borns.contains(&key) {                
                    choromosomes.push(Self{
                        board:x.board.copy(),
                        age:x.age,
                        score:x.score
                    });
                }
            }
        }

        choromosomes.sort_by(|a,b| b.score.cmp(&a.score));
        choromosomes.truncate(size);

        choromosomes
    }
    fn init_population(dictionary:&mut Dictionary,size:usize, board_x:usize,board_y:usize) -> Vec<GeneticBoard>{
        let mut choromosomes : Vec<GeneticBoard> = Vec::new();
        let mut new_borns = HashSet::new();
        while new_borns.len()<size {
            let brd = Board::new_random(board_x,board_y);
            let key = brd.hash();
            if new_borns.contains(&key) {
                continue;
            }
            let score = dictionary.get_board_score(&brd);

            let gen_board = Self{
                board:brd,
                age:0,
                score:score
            };
            new_borns.insert(key);
            choromosomes.push(gen_board);
        }
        choromosomes.sort_by(|a,b| b.score.cmp(&a.score));

        choromosomes
    }

    fn merge(&self, other : &GeneticBoard) -> Self {
        let boards = Self::order(&self,other);

        let mut merged = Self{
            board:boards.0.board.copy(),
            age:boards.0.age+1,
            score:0
        };

        let similarity = Self::similarity(&boards.0.board,&boards.1.board);

        let first_share = if similarity < 0.80 { 70 } else { 70 };
        let second_share = if similarity < 0.80 { 99 } else { 80 };

        let uniform = Uniform::try_from(0..101).unwrap();
        let uniform2 = Uniform::try_from(0..26).unwrap();
        let mut rng = rand::rng();

        for i in 0..boards.0.board.get_x() {
            for j in 0..boards.0.board.get_y() {
                let rand = uniform.sample(&mut rng);
                if rand < first_share {continue;}//the board cell can stay the initilized value.
                else if rand < second_share {merged.board.set(i,j,boards.1.board.get(i,j).expect("must have value always"));} // get chromosoms from the second board
                else {
                    //mutate
                    let rnd = uniform2.sample(&mut rng);
                    let random_char = (b'A' + rnd) as char;
                    merged.board.set(i,j,random_char);
                }
            }
        }        
        
        merged
    }

    //this function's return type contains a borrowed value, but the signature does not say whether it is borrowed from `this` or `that`
    //help: consider introducing a named lifetime parameter
    fn order<'a>(this: &'a GeneticBoard,that: &'a GeneticBoard)->(&'a GeneticBoard,&'a GeneticBoard){
        if this.score>that.score { return (this,that); }
        if this.score<that.score { return (that,this); }
        let mut rng = rand::rng();
        let rnd = rng.random_range(0..=1);
        if rnd==0 { return (this,that);}
        (that,this)
    }

    fn similarity(this:&Board, that:&Board) -> f32{
        let mut same:f32 = 0.0;
        for i in 0..this.get_x() {
            for j in 0..this.get_y() {
                let ch1 = this.get(i,j).expect("must have value always");
                let ch2 = that.get(i,j).expect("must have value always");
                if ch1==ch2 { same+=1.0;}
            }
        }
        same/(this.get_x() as f32 * this.get_y() as f32)
    }
}