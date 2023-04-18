namespace BoggleGame.Tests;

[Collection("BoggleGame")]
[TestCaseOrderer("Xunit.Microsoft.DependencyInjection.TestsOrder.TestPriorityOrderer", "Xunit.Microsoft.DependencyInjection")]
public class BoggleFileRepositoryTests: TestCollection
{
    private readonly BoggleFileRepository? boggleFileRepository;
    public BoggleFileRepositoryTests(ITestOutputHelper output, TestFixture fixture) : base(output, fixture)
    {
        this.boggleFileRepository = _fixture.GetService<BoggleFileRepository>(_testOutputHelper);
    }

    [Fact(DisplayName = "At least one dictionary exist"),TestOrder(1)]
    public  void ThereIsADictionary()
    {        
        Assert.True(boggleFileRepository.GetDictionaries().Any());
    }

    [Fact(DisplayName = "At least one board exist"),TestOrder(1)]
    public  void ThereIsABoard()
    {
        Assert.True(boggleFileRepository.GetBoards().Any());
    }

}