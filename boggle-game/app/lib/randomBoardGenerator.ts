const Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const Frequencies:number[] = [
        0.08167, 0.01492, 0.02782, 0.04253, 0.12703, 0.02228,
        0.02015, 0.06094, 0.06966, 0.00153, 0.00772, 0.04025,
        0.02406, 0.06749, 0.07507, 0.01929, 0.00095, 0.05987,
        0.06327, 0.09056, 0.02758, 0.00978, 0.02360, 0.00150,
        0.01974, 0.00074
];

let sum = 0;
const Frequency_intervals:number[] = Frequencies.map((f):number=>{
        sum+=f;
        return sum;
})

export function getRandomLetter(){
        const rnd = Math.random();
        let i=0;
        let j=Frequencies.length-1;
        while(i<j){
                if(i==j)
                        return Alphabet[i];
                const k = Math.floor((i+j)/2);
                if(rnd==Frequency_intervals[k]) return Alphabet[k];
                if(rnd>Frequency_intervals[k])
                        i=k+1;
                else 
                        j=k-1;
        }
        return Alphabet[j<0?0:j];
} 

export function getBoard() : any {
        return Array.from({length:4}, ()=>Array.from({length:4},()=>getRandomLetter()));
}