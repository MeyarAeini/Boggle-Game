using Microsoft.AspNetCore.Mvc;
using BoggleGame.Dto;

namespace BoggleGame.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BoggleSolverController : ControllerBase
{

    private readonly ILogger<BoggleSolverController> _logger;
    private readonly BoggleFileRepository boggleFileRepository;

    public BoggleSolverController(BoggleFileRepository boggleFileRepository,ILogger<BoggleSolverController> logger)
    {
        _logger = logger;
        this.boggleFileRepository = boggleFileRepository;
    }

    [HttpPost("Solve")]
    public async Task<IEnumerable<string>> Solve(BoggleGameSolveRequest request)
    {
        using(var dictionaryFile = await boggleFileRepository.GetDictionaryStreamReaderAsync(request.dictionary) )
        using(var boardFile = await boggleFileRepository.GetBoardStreamReaderAsync(request.board) ){
            var boggleSolver = new BoggleSolver(dictionaryFile);
            var board = new BoggleBoard(boardFile);
            var words = boggleSolver.getAllValidWords(board);
            return words;
        }
    }

    [HttpGet("GetBoards")]
    public IEnumerable<string> GetBoards()
    {
        return boggleFileRepository.GetBoards();
    }

    [HttpGet("GetBoard/{boardName}")]
    public async Task<string> GetBoardAsync(string boardName)
    {
        using(var boardFile = await boggleFileRepository.GetBoardStreamReaderAsync(boardName))
        return await boardFile.ReadToEndAsync();
    }

    [HttpGet("GetBoard/{m}/{n}")]
    public string GetBoard(int m, int n)
    {
        var board = new BoggleBoard(m,n);
        return board.ToString();
    }

    [HttpPost("SolveBoard")]
    public async Task<Dictionary<string,int>> SolveBoardAsync( char[][] board)
    {
        var brd = new BoggleBoard(board);
        using(var dictionaryFile = await boggleFileRepository.GetDictionaryStreamReaderAsync("common") )
        {
            var boggleSolver = new BoggleSolver(dictionaryFile);
            var words = boggleSolver.getAllValidWords(brd);
            Dictionary<string,int> wordScores = new Dictionary<string, int>();
            foreach(var word in words)
            {
                if(wordScores.ContainsKey(word)) continue;
                wordScores.Add(word,boggleSolver.scoreOf(word));
            }
            return wordScores;
        }
    }

    [HttpGet("GetDictionaries")]
    public IEnumerable<string> GetDictionaries()
    {
       return boggleFileRepository.GetDictionaries();
    }
}
