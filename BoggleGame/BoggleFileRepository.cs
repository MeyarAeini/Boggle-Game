namespace BoggleGame;

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
public class BoggleFileOptions
{
    public string Directory { get; set; }
    public string DictionaryPrefix { get; set; }
    public string BoardPrefix { get; set; }
}

public class BoggleFileRepository
{
    private readonly BoggleFileOptions _option;
    private readonly ILogger<BoggleFileRepository> _logger;
    public BoggleFileRepository(ILogger<BoggleFileRepository> logger,IOptions<BoggleFileOptions> option)
        => (_logger, _option) = (logger, option.Value);

    public IEnumerable<string> GetDictionaries()
    {
       return GetFileNamesStartWith(_option.DictionaryPrefix);
    }

    public IEnumerable<string> GetBoards()
    {
        return GetFileNamesStartWith(_option.BoardPrefix);
    }

    public async Task<StreamReader> GetBoardStreamReaderAsync(string boardKey)
    {
        var name = GetFullNameFileName(_option.BoardPrefix,boardKey);
        return new StreamReader(name);
    }

    public async Task<StreamReader> GetDictionaryStreamReaderAsync(string dictionaryKey)
    {
        var name = GetFullNameFileName(_option.DictionaryPrefix,dictionaryKey);
        return new StreamReader(name);        
    }

    private IEnumerable<string> GetFileNamesStartWith(string prefix)
    {
        string path = _option.Directory;
        return Directory.GetFiles(path)
        .Select(it=>it.Substring(path.Length,it.Length-path.Length-4))
        .Where(it=>it.StartsWith(prefix))
        .Select(it=>it.Substring(prefix.Length));
    }

    private string GetFullNameFileName(string prefix,string name)
    {
        return Path.Combine(_option.Directory,$"{prefix}{name}.txt");
    }
}