namespace BoggleGame;

using System.Text;
using BoggleGame.Dto;

internal class BoggleBoardPath
{
    Stack<BoggleBoardPos> path;
    HashSet<int> keys;
    BoggleBoard board;
    bool unique=false;
    int MAX_J = 10;
    StringBuilder sb;
    public BoggleBoardPath(BoggleBoard board, bool unique = true)
    {
        path = new Stack<BoggleBoardPos>();
        this.board = board; 
        this.unique = unique;       
        keys = new HashSet<int>();
        MAX_J = (board.cols/10 + 1)*10;
        sb = new StringBuilder();
    }
    public void CleanUp()
    {
        path.Clear();       
        keys.Clear();
        sb.Clear();
    }

    public bool IsValidDice(int i,int j)
    {
        if(i<0 || j<0 || i>=board.rows || j>=board.cols) return false;
        var key = getKey(i,j);
        if(unique && keys.Contains(key)) return false;
        return true;
    }
    public bool Push(int i,int j){
        //if(!(IsValidDice(i,j))) return false;
        if(unique){
            keys.Add(getKey(i,j));            
        }
        path.Push(new BoggleBoardPos(i,j));
        sb.Append(board.getLetter(i,j));
        return true;
    }
    public bool Pop(){
        if(path.Count==0) return false;
        if(unique){
            var top = path.Peek();
            keys.Remove(getKey(top.row,top.col));           
        }
        if(path.Pop()!=null)
            sb.Remove(sb.Length-1,1);
        return true;
    }
    public char Top()
    {
        if(path.Count==0) return ' ';
        var top = path.Peek();
        return board.getLetter(top.row,top.col);
    }
    public string GetWord(){
        
        return sb.ToString();
    }
    public int ReturnTo(int row, int column)
    {
        if(path.Count==0) return 0;

        var top = path.Peek();
        int steps=0;
        while(top.row!=row || top.col!=column){ 
            steps+=1;
            if(unique){
                keys.Remove(getKey(top.row,top.col));
            }    
            path.Pop(); 
            if(path.Count==0) break;  
            top = path.Peek();            
        }
        sb.Remove(sb.Length-steps,steps);
        return steps;
    }
    public List<BoggleBoardPos> GetPath()
    {
        return path.ToList();
    }
    private int getKey(int i,int j){
        return i*MAX_J+j;
    }
    public override string ToString()
    {
        StringBuilder sb = new StringBuilder();
        foreach(var n in path)
        {
            sb.Append($" ({n.row},{n.col}) ");
        }
        return sb.ToString();
    }
}