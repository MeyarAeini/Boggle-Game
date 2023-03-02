namespace BoggleGame;

internal class BoggleBoardPath
{
    Stack<(int,int)> path;
    HashSet<int> keys;
    BoggleBoard board;
    bool unique=false;
    int MAX_J = 10;
    public BoggleBoardPath(BoggleBoard board, bool unique = true)
    {
        path = new Stack<(int, int)>();
        this.board = board; 
        this.unique = unique;       
        keys = new HashSet<int>();
        MAX_J = (board.cols/10 + 1)*10;
    }
    public bool Push(int i,int j){
        if(i<0 || j<0 || i>=board.rows || j>=board.cols) return false;
        if(unique){
            var key = getKey(i,j);
            if(keys.Contains(key)) return false;
            keys.Add(key);
        }
        path.Push((i,j));
        return true;
    }
    public bool Pop(){
        if(path.Count==0) return false;
        if(unique){
            var top = path.Peek();
            keys.Remove(getKey(top.Item1,top.Item2));
        }
        path.Pop();
        return true;
    }
    public char Top()
    {
        if(path.Count==0) return ' ';
        var top = path.Peek();
        return board.getLetter(top.Item1,top.Item2);
    }
    public int ReturnTo(int row, int column)
    {
        if(path.Count==0) return 0;

        var top = path.Peek();
        int steps=0;
        while(top.Item1!=row && top.Item2!=column){ 
            steps+=1;
            if(unique){
                keys.Remove(getKey(top.Item1,top.Item2));
            }    
            path.Pop(); 
            if(path.Count==0) break;  
            top = path.Peek();            
        }
        return steps;
    }
    private int getKey(int i,int j){
        return i*MAX_J+j;
    }
}