
namespace BoggleGame.Tests;

[Collection("BoggleGame")]
[TestCaseOrderer("Xunit.Microsoft.DependencyInjection.TestsOrder.TestPriorityOrderer", "Xunit.Microsoft.DependencyInjection")]
public class BoggleSolverBasicTests: TestCollection
{
    private readonly BoggleFileRepository? boggleFileRepository;
    public BoggleSolverBasicTests(ITestOutputHelper output, TestFixture fixture) : base(output, fixture)
    {
        this.boggleFileRepository = _fixture.GetService<BoggleFileRepository>(_testOutputHelper);
    }

    [Fact(DisplayName = "Solving 16q board with 16q dictionary"),TestOrder(1)]
    public  async Task Solve16q()
    {
        var words = await Solve("16q","16q");
        Assert.True(words.Count()==16);
    }

    [Theory(DisplayName = "Solve randoam board"),TestOrder(2)]
    [InlineData("yawl",4,4)]
    [InlineData("yawl",10,10)]
    [InlineData("yawl",1,6)]
    [InlineData("yawl",7,1)]
    public  async Task SolveRandomBoard(string dictionary, int rows, int cols)
    {
        var solver = await getSolver(dictionary);
        if(solver==null)
        {
            Assert.Fail("boggle solver is null");
        }
        var board = new BoggleBoard(rows,cols);
        var words = solver.getAllValidWords(board);
       Assert.True(words.Count()>=1);
    }

    [Theory(DisplayName = "Performance test on solving boggle game"),TestOrder(3)]
    [InlineData("yawl")]
    public  async Task PerformanceTest(string dictionary)
    {
        System.Diagnostics.Stopwatch watch = new System.Diagnostics.Stopwatch();
        watch.Start();
        var solver = await getSolver(dictionary);
        _testOutputHelper.WriteLine($"Time elapsed for initiating {dictionary} boggle solver : {watch.ElapsedMilliseconds}");
        watch.Stop();
        if(solver==null)
        {
            Assert.Fail("boggle solver is null");
        }
        int biggerThanOneSecond = 0;
        for(int i=1;i<11;i++)
        {
            for(int j=1;j<11;j++)
            {
                var x = PerformanceTestBoggleSolver(i, j, solver);
                if(x>1000)
                {
                    biggerThanOneSecond++;
                }
                var limit =Math.Pow(2,i*j/10) * 1000;
                if(x>limit && x>1200)
                {
                    Assert.Fail($"{biggerThanOneSecond}");
                }
            }
        } 
         _testOutputHelper.WriteLine($"Time elapsed for initiating {dictionary} boggle solver : {watch.ElapsedMilliseconds}");           
    }

    private long PerformanceTestBoggleSolver(int m, int n, BoggleSolver solver)
    {
        System.Diagnostics.Stopwatch watch = new System.Diagnostics.Stopwatch();
        watch.Start();
        var boards = getRandomBoards(m,n,1000).ToList();
        _testOutputHelper.WriteLine($"Time elapsed for generating {1000} random {m}*{n} boards : {watch.ElapsedMilliseconds}");
        watch.Reset(); 
        watch.Start();
        foreach(var board in boards)
        {
            solver.getAllValidWords(board).ToArray();
        }  

        /*
        Console.WriteLine($"{sw.ElapsedMilliseconds/1000} - {words.Count}");
       Console.WriteLine(words.Keys.Sum(it=>scoreOf(it.Replace(Constants.QU.ToString(),Constants.QuValue))));
        */   
       _testOutputHelper.WriteLine($"Time elapsed for solving {1000} random {m}*{n} boards : {watch.ElapsedMilliseconds}");
       return watch.ElapsedMilliseconds;
    }

    private async Task<IEnumerable<string>> Solve(string dictionaryKey, string boardKey)
    {
        if(boggleFileRepository==null)
        {
            return Enumerable.Empty<string>();
        }
        using(var dictionaryFile = await boggleFileRepository.GetDictionaryStreamReaderAsync(dictionaryKey) )
        using(var boardFile = await boggleFileRepository.GetBoardStreamReaderAsync(boardKey) ){
            var boggleSolver = new BoggleSolver(dictionaryFile);
            var board = new BoggleBoard(boardFile);
            var words = boggleSolver.getAllValidWords(board);
            return words;
        }
    }

    private async Task<BoggleSolver?> getSolver(string dictionaryKey)
    {
        if(boggleFileRepository==null)
        {
            return null;
        }
        using(var dictionaryFile = await boggleFileRepository.GetDictionaryStreamReaderAsync(dictionaryKey) )
            return new BoggleSolver(dictionaryFile);
    }

    private IEnumerable<BoggleBoard> getRandomBoards(int row, int col, int count)
    {
        for(int i=0;i<count;i++)
        {
            yield return new BoggleBoard(row,col);
        } 
    }
}