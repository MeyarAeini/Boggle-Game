# Boggle board generator

The purpose of this project is to create a scalable service which would be able to generate a high quality boggle board in matter of second, so the user would be able to experince a smooth game response without loosing the chance of playing a random game each time.

This application at the end would be very simple from the outside world and only has very limited functionality which mainly would be generating a boggle board to be used by other part of this application or other applications.

This project is my first try with rust and it will be improved overtime. 

## Challenges 
The main focus of this project is focusing on two things :
- Randomness
- Multi-threading and scalability

For generating a random boggle board I am using genetic algorithm which needs a random functions to evolve each generation and improve the qulity of each generation boards. On the other hand since each generation has a risk and possibility to get so similar to each other and reduce the level of diversity and randomness I belive it is needed to use multiple parallel threads to run the genetic algorithm by possibility of sharing choromosomes.
My very first result of performance from time of generating a random board with score higher than 3000 there was not much difference to its typescript version. I believe my experince and knowledge in rust has played a key rule and I believe I can improve it overtime, on the other hand for future ehancement to this function rust will be much better choice for it.

## Enhancements to come
- Add unit tests
- Add multi-threading
- Expose an API for integration with the other part of the application
- Configure docker for the crate
- Create a very simple command line for it.
## How to run
   ```bash
   cargo run
   ```

