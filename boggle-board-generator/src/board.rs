use rand::Rng;
use rand::distr::{Distribution, Uniform};

pub struct Board{
    x:usize,
    y:usize,
    grid:Vec<Vec<char>>,
}

impl Board{

    
    pub fn new(grid:Vec<Vec<char>>,x:usize,y:usize)->Self{
        Self{
            x:x,
            y:y,
            grid:grid,
        }
    }

    pub fn get_x(&self) -> usize{
        self.x
    }

    pub fn get_y(&self) -> usize{
        self.y
    }

    pub fn new_random(x:usize, y:usize)->Self{
        let mut brd = Self{
            x:x,
            y:y,
            grid:vec![vec![' ';y];x]
        };

        let uniform = Uniform::try_from(0..26).unwrap();
        let mut rng = rand::rng();

        for i in 0..x {
            for j in 0..y {
                let rnd = uniform.sample(&mut rng);;
                let random_char = (b'A' + rnd) as char;
                brd.set(i,j,random_char);
            }
        }
        
        
        brd
    }

    pub fn copy(&self) -> Self{
        Self{
            x:self.x,
            y:self.y,
            grid:self.grid.to_vec(),
        }
    }

    pub fn to_string(&self)->String{
        let mut s = String::new();
        for row in &self.grid {
            s.push('\n');
            for cell in row{
                s.push(*cell);
            }
        }

        s
    }

    pub fn hash(&self)->String{
        let mut s = String::new();
        for row in &self.grid {
            for cell in row{
                s.push(*cell);
            }
        }

        s
    }

    pub fn get(&self, i:usize,j:usize)->Option<char>{
        if i>=self.x || j>=self.y
        {
            return None;
        }
        Some(self.grid[i][j])

        // let row = self.grid.get(i);
        // match row {
        //     Some(row)=>{
        //         let item = (*row).get(j);
        //         match item{
        //             Some(item) => return Some(*item);
        //             None => return None;
        //         }
        //     },
        //     None => return None,
        // }
    }  
    
    pub fn set(&mut self, i:usize,j:usize,ch:char){
        if !(i>=self.x || j>=self.y)
        {
            self.grid[i][j] = ch;
        }
    }
}