namespace BoggleGame.Tests;
using Xunit.Abstractions;
public class BoggleBoardBasicTests
{
    private static readonly double[] FREQUENCIES = {
        0.08167, 0.01492, 0.02782, 0.04253, 0.12703, 0.02228,
        0.02015, 0.06094, 0.06966, 0.00153, 0.00772, 0.04025,
        0.02406, 0.06749, 0.07507, 0.01929, 0.00095, 0.05987,
        0.06327, 0.09056, 0.02758, 0.00978, 0.02360, 0.00150,
        0.01974, 0.00074
    };

    private readonly ITestOutputHelper output;

    public BoggleBoardBasicTests(ITestOutputHelper output)
    {
        this.output = output;
    }

    [Fact]
    public void GenerateABoard()
    {
        BoggleBoard[] boards = new BoggleBoard[100];
        for(int i=0;i<100;i++)
        {
            boards[i] = new BoggleBoard(4,4);
            output.WriteLine(boards[i].ToString());
        }
        for(int i=0;i<99;i++)
        {
            Assert.False(TheyAreVerySimilar(boards[i],boards[i+1]));
        }
    }

    [Fact]
    public void CharacterFrequencyIsOk()
    {
        SortedDictionary<char,int> occurrence = new SortedDictionary<char, int>();
        for(int i=0;i<int.MaxValue;i++)
        {
            var ch = BoggleBoard.GetNextRandomChar();
            if(occurrence.ContainsKey(ch))
                occurrence[ch]++;
            else
                occurrence.Add(ch,1);
        }
        var frequencies = new double[BoggleBoard.FREQUENCIES.Length];
        double differenceTotal = 0.0;
        for(int i=0;i<occurrence.Count;i++)
        {
            var probability = occurrence.ContainsKey(BoggleBoard.ALPHABET[i]) ? (double)occurrence[BoggleBoard.ALPHABET[i]]/(double)int.MaxValue : 0.0;
            probability = Math.Round(probability, 5);
            differenceTotal += Math.Abs(BoggleBoard.FREQUENCIES[i]-probability);

            output.WriteLine($"{BoggleBoard.FREQUENCIES[i]} vs {probability} ; {BoggleBoard.FREQUENCIES[i]-probability}");
        }
        output.WriteLine($"total difference = {differenceTotal}");
        Assert.True(differenceTotal<0.0001);
    }

    private bool TheyAreVerySimilar(BoggleBoard a,BoggleBoard b)
    {
        int equals=0;
        for(int i=0;i<a.rows;i++)
        {
            for(int j=0;j<a.cols;j++)
                if(a.getLetter(i,j)==b.getLetter(i,j)) equals++;
        }
         return equals>= (a.rows*a.cols)/2;
    }
}