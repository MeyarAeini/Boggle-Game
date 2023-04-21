namespace BoggleGame.Client.Services;
using BoggleGame.Dto;

public interface IBoggleResolver
{
    Task<IEnumerable<string>> GetDictionaries();
    Task<IEnumerable<string>> GetBoards();
    Task<BoardItem[][]> GetBoard(string name);
    Task<char[][]> GetBoard(int m, int n);
    Task<IEnumerable<string>> Solve(string dictionary, string board);
    BoardItem[][] SetBoard(BoardItem[][] board,WordPath selectedPath);
    Task<Dictionary<string,int>> SolveBoard(char[][] board);
}
