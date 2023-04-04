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

    [HttpGet("GetDictionaries")]
    public IEnumerable<string> GetDictionaries()
    {
       return boggleFileRepository.GetDictionaries();
    }
}
