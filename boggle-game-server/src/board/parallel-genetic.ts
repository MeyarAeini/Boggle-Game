import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import { GeneticBoggleBoard } from "./genetic-boggle-board";
import { GeneticPopulation } from "./genetic-population";

const POPULATION_SIZE = 200;
const NUM_INSTANCES = 4; // Number of parallel genetic populations
const GENERATION_LIMIT = 200;
const TARGET_SCORE = 2500;

async function runGeneticParallel(dictionaryService: any): Promise<GeneticBoggleBoard> {
    const sharedTopChromosomes: GeneticBoggleBoard[][] = Array(NUM_INSTANCES).fill([]);
    
    const workers = Array.from({ length: NUM_INSTANCES }, (_, index) =>
        new Promise<GeneticBoggleBoard>((resolve) => {
            const worker = new Worker(__filename, {
                workerData: { index, dictionaryService, sharedTopChromosomes }
            });

            worker.on("log", (message) => {
                console.log(message);
                //resolve(bestChromosome);
            });

            worker.on("message", (bestChromosome) => {
                console.log(bestChromosome);
                resolve(bestChromosome);
            });

            worker.on("error", (err) => console.error(`Worker ${index} error:`, err));
        })
    );

    const bestResults = await Promise.all(workers);
    return bestResults.sort((a, b) => b.score - a.score)[0]; // Return the best overall result
}
if (!isMainThread){
    async function geneticWorker() {
        const { index, dictionaryService, sharedTopChromosomes } = workerData;
        parentPort?.postMessage({ type: "log", message: `Worker ${index} - hi` });
        let genetic = new GeneticPopulation(dictionaryService.trie, 200, []);
        let bestScore = genetic.getElite(1)[0].score;
    
        while (bestScore < 2500) {
            for (let generation = 0; generation < 200; generation++) {
                genetic.evolve();
                bestScore = genetic.getElite(1)[0].score;
    
                // Send log messages to the main thread
                parentPort?.postMessage({ type: "log", message: `Worker ${index} - Gen ${generation}, Score: ${bestScore}` });
    
                // Inject chromosomes every 20 generations
                if (generation % 20 === 0) {
                    genetic.injectChromosomes(sharedTopChromosomes.flat());
                }
            }
    
            parentPort?.postMessage({ type: "log", message: `Worker ${index} - Jump` });
            sharedTopChromosomes[index] = genetic.getElite(3);
            genetic = new GeneticPopulation(dictionaryService.trie, 200, genetic.getElite(3));
        }
    
        // Send final result to the main thread
        parentPort?.postMessage({ type: "result", best: genetic.getElite(1)[0] });
    }
    geneticWorker();
}

export default runGeneticParallel;