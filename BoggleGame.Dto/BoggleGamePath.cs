namespace BoggleGame.Dto;

public record BoggleGamePath (string word, List<BoggleBoardPos> path);
public record BoggleBoardPos(int row,int col);
public record BoggleGameSolveRequest (string dictionary, string board);
public record BoggleGameValidWord (string word, HashSet<List<BoggleBoardPos>> path);

public record WordPath
{
    public IList<BoggleBoardPos> Segments { get; init;}
    public WordPath() => Segments = new List<BoggleBoardPos>();
    public WordPath(IList<BoggleBoardPos> segments) => Segments = segments;
    public void Add(BoggleBoardPos segment)
    {
        Segments.Add(segment);
    }

    public override int GetHashCode()
    {
        var hash = new HashCode();

        for (var i = 0; i < Segments?.Count; i++)
            hash.Add(Segments[i]);

        return hash.ToHashCode();
    }
}