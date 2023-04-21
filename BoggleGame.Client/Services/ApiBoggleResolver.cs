namespace BoggleGame.Client.Services;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Net.Http.Json;
using System.Text.Json;
using BoggleGame.Dto;

public class ApiBoggleResolver : IBoggleResolver
{
    private readonly HttpClient httpClient;
    private readonly ILogger<ApiBoggleResolver> logger;
    public ApiBoggleResolver(HttpClient httpClient,ILogger<ApiBoggleResolver> logger)
    {
        this.httpClient = httpClient;
        this.logger = logger;
    }

    public async Task<IEnumerable<string>> GetDictionaries()
    {
        return await httpClient.GetFromJsonAsync<string[]>("BoggleSolver/GetDictionaries");
    }

    public async Task<IEnumerable<string>> GetBoards()
    {
        return await httpClient.GetFromJsonAsync<string[]>("BoggleSolver/GetBoards");
    }

    public async Task<BoardItem[][]> GetBoard(string name)
    {
        var board = await httpClient.GetStringAsync($"BoggleSolver/GetBoard/{name}");
        using (StringReader reader = new StringReader(board))
        {
            string line = reader.ReadLine();
            if(line==null)
            {
                return null;                
            }
           
            var dim = line.Split(' ');
            int rows = int.Parse(dim[0]);
            int columns = int.Parse(dim[1]);

            BoardItem[][] brd = new BoardItem[rows][];
            for(int i=0;i<rows;i++)
            {
                brd[i] = reader.ReadLine().Split(' ').Where(it=>it!=" " && it.Length>0)
                .Select(it=>new BoardItem(){Character=it}).ToArray();
            }
            return brd;
        }
    }
    public async Task<char[][]> GetBoard(int m, int n)
    {
        var board = await httpClient.GetStringAsync($"BoggleSolver/GetBoard/{m}/{n}");
        char[][] brd = new char[m][];
        var lines = board.Split(Environment.NewLine);
        for(int i=0;i<m;i++)
        {
            brd[i] = new char[n];
            var chars = lines[i].Split(' ');
            for(int j=0;j<n;j++){
                brd[i][j] = chars[j][0];
            }
        }
        return brd;
    }
    public async Task<Dictionary<string,int>> SolveBoard(char[][] board){
        using var response = await httpClient.PostAsJsonAsync($"BoggleSolver/SolveBoard",board);
        return await response.Content.ReadFromJsonAsync<Dictionary<string,int>>();
    }
    public async Task<IEnumerable<string>> Solve(string dictionary, string board)
    {
        var request = new BoggleGameSolveRequest(dictionary,board);
        using var response = await httpClient.PostAsJsonAsync("BoggleSolver/Solve", request);
        return await response.Content.ReadFromJsonAsync<IEnumerable<string>>();
    }
    public BoardItem[][] SetBoard(BoardItem[][] board,WordPath selectedPath)
    {
        if(board==null){
            return board;
        }
        for(int i=0;i<board.Length;i++){
            for(int j=0;j<board[i].Length;j++){
                board[i][j].Selected = false;
                board[i][j].Sequence = 0;
            }
        }
        int k=selectedPath.Segments.Count;
        foreach(var item in selectedPath.Segments){
            board[item.row][item.col].Selected = true;
            board[item.row][item.col].Sequence = k;
            k--;
        }
        return board;
    }
}
public class BoardItem
{
    public string Character { get; init; }
    public bool Selected { get; set; }
    public int Sequence { get; set; }
    public string DisplayValue => Selected?$"{Character}({Sequence})":Character;
}