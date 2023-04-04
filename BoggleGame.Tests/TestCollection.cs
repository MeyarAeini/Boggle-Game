namespace BoggleGame.Tests;
using Xunit.Abstractions;
public class TestCollection : TestBed<TestFixture>
{
    public TestCollection(ITestOutputHelper output, TestFixture fixture) : base(output, fixture)
    {
    }
}