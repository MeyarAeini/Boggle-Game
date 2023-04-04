namespace BoggleGame.Tests;
using Xunit.Abstractions;

[Collection("BoggleGame")]
public class BoggleBoardBasicTests : TestCollection
{
    public BoggleBoardBasicTests(ITestOutputHelper output, TestFixture fixture) : base(output, fixture)
    {
    }

    [Fact(DisplayName = "Generate 100 boggle boards by letter frequencies, randomness check")]
    public void GenerateABoardByLetterFrequencies()
    {
        BoggleBoard[] boards = new BoggleBoard[100];
        for(int i=0;i<100;i++)
        {
            boards[i] = new BoggleBoard(4,4);
        }
        for(int i=0;i<99;i++)
        {
            BoggleTestHelper.AssertNotSimilar(boards[i],boards[i+1]);
        }
    }

    [Theory]
    [InlineData(2,2,5000)]
    [InlineData(3,3,10000)]
    [InlineData(3,4,10000)]
    [InlineData(4,4,10000)]
    [InlineData(1,4,10000)]
    [InlineData(5,1,10000)]
    [InlineData(5,5,10000)]
    [InlineData(10,10,10000)]   
    [TestOrder(1)]
    public void PerformanceTest(int m,int n,int count)
    {
        BoggleBoard? a = null;
        BoggleBoard? b = null;
        for(int i=0;i<count;i++)
        {
            b = a;
            a = new BoggleBoard(m,n);
            if(b!=null)
            if(m*n<=10)
            {
                BoggleTestHelper.AssertNotEqual(a,b);
            }
            else{
                BoggleTestHelper.AssertNotSimilar(a,b);
            }
        }
    }

    [Fact(DisplayName = "Generate 100 boggle boards by rolling hasbro dice, randomness check")]
    public void GenerateABoardByRollingHasbroDice()
    {
        BoggleBoard[] boards = new BoggleBoard[100];
        for(int i=0;i<100;i++)
        {
            boards[i] = new BoggleBoard();
        }
        for(int i=0;i<99;i++)
        {
            BoggleTestHelper.AssertNotSimilar(boards[i],boards[i+1]);
        }
    }

    [Theory]
    //[InlineData(int.MaxValue,.0001)] //for real probability
    [InlineData(int.MaxValue/1000,.004)]
    [TestOrder(10)]
    public void CharacterFrequencyIsOk(int charCount, double limit)
    {
        var brdInstance = new BoggleBoard();
        SortedDictionary<char,int> occurrence = new SortedDictionary<char, int>();
        for(int i=0;i<charCount;i++)
        {
            var ch = brdInstance.GetNextRandomChar();
            if(occurrence.ContainsKey(ch))
                occurrence[ch]++;
            else
                occurrence.Add(ch,1);
        }
        var frequencies = new double[BoggleBoard.FREQUENCIES.Length];
        double differenceTotal = 0.0;
        for(int i=0;i<BoggleBoard.ALPHABET.Length;i++)
        {
            var ch = BoggleBoard.ALPHABET[i];
            var probability = occurrence.ContainsKey(ch) ? (double)occurrence[ch]/(double)charCount : 0.0;
            probability = Math.Round(probability, 5);
            differenceTotal += Math.Abs(BoggleBoard.FREQUENCIES[i]-probability);

            //_testOutputHelper.WriteLine($"{ch} : {BoggleBoard.FREQUENCIES[i]} vs {probability} ; Difference : {BoggleBoard.FREQUENCIES[i]-probability}");
        }
        _testOutputHelper.WriteLine($"total difference = {differenceTotal}");
        Assert.True(differenceTotal<limit);
    }
}