using Microsoft.AspNetCore.Mvc;
using BoggleGame.Dto;

namespace BoggleGame.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BoggleSolverController : ControllerBase
{

    private readonly ILogger<BoggleSolverController> _logger;

    public BoggleSolverController(ILogger<BoggleSolverController> logger)
    {
        _logger = logger;
    }

    [HttpPost("Solve")]
    public IEnumerable<string> Solve(BoggleGameSolveRequest request)
    {
        var boggleSolver = new BoggleSolver(GetFullNameFileName(DictionaryPrefix,request.dictionary));
        var board = new BoggleBoard(GetFullNameFileName(BoardPrefix,request.board));
        var words = boggleSolver.getAllValidWords(board);
        return words;
    }

    [HttpGet("GetBoards")]
    public IEnumerable<string> GetBoards()
    {
        return GetFileNamesStartWith(BoardPrefix);
    }

    [HttpGet("GetBoard/{boardName}")]
    public async Task<string> GetBoardAsync(string boardName)
    {
        var name = GetFullNameFileName(BoardPrefix,boardName);
        string? board = null;
        using(var sr = new StreamReader(name))
        {            
            board= await sr.ReadToEndAsync();
        }
        return board;
    }

    [HttpGet("GetDictionaries")]
    public IEnumerable<string> GetDictionaries()
    {
       return GetFileNamesStartWith(DictionaryPrefix);
    }
    const string DictionaryPrefix = "dictionary-";
    const string BoardPrefix = "board-";

    private IEnumerable<string> GetFileNamesStartWith(string prefix)
    {
        string path = @"..\BoggleGame\files\";
        return Directory.GetFiles(path)
        .Select(it=>it.Substring(path.Length,it.Length-path.Length-4))
        .Where(it=>it.StartsWith(prefix))
        .Select(it=>it.Substring(prefix.Length));
    }

    private string GetFullNameFileName(string prefix,string name)
    {
        string path = @"..\BoggleGame\files\";
        return  $"{path}{prefix}{name}.txt";
    }
}
