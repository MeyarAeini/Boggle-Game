import { parentPort } from "worker_threads";
import { GeneticPopulation } from "./genetic-population";

async function geneticWorker(index: number, dictionaryService: any, sharedTopChromosomes: any[]) {
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
