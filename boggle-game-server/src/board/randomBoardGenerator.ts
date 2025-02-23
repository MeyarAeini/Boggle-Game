const Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const Frequencies: number[] = [
        0.08167, 0.01492, 0.02782, 0.04253, 0.12703, 0.02228,
        0.02015, 0.06094, 0.06966, 0.00153, 0.00772, 0.04025,
        0.02406, 0.06749, 0.07507, 0.01929, 0.00095, 0.05987,
        0.06327, 0.09056, 0.02758, 0.00978, 0.02360, 0.00150,
        0.01974, 0.00074
];

const Frequency_intervals: number[] = Frequencies.reduce<number[]>((arr, cur, index) => {
        arr.push((arr[index - 1] || 0) + cur);
        return arr;
}, []);

export function getRandomLetter(): string {
        const rnd = Math.random();
        let i = 0;
        let j = Frequencies.length - 1;
        while (i < j) {
                const k = Math.floor((i + j) / 2);
                if (rnd == Frequency_intervals[k]) return Alphabet[k];
                if (rnd > Frequency_intervals[k])
                        i = k + 1;
                else
                        j = k - 1;
        }
        return Alphabet[j < 0 ? 0 : j];
}

export function getBoard(): string[][] {
        return Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => getRandomLetter()));
}

export function getBoardString(): string {
        let result = "";
        for (let i = 0; i < 16; i++) {
                result += getRandomLetter();
        }
        return result;
}