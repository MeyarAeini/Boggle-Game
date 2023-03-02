namespace BoggleGame;

using System.Text;

internal class TrieSearchSession
{
    TrieNode cursor;
    Stack<TrieNode> path;
    StringBuilder sb;
    public TrieSearchSession(TrieNode root){
        cursor = root;
        path = new Stack<TrieNode>();
        sb = new StringBuilder();
    }
    public bool MoveForward(char ch){
        var result = cursor.Find(ch);
        if(result!=null){
            sb.Append(ch);
            path.Push(cursor);
            cursor=result;            
        }
        return result != null;
    }
    public bool IsaWord=> cursor != null && cursor.IsLeaf;
    public string Word => sb.ToString().Replace(Constants.QU.ToString(),Constants.QuValue);
    public bool Back(){
        if(path.Count==0)return false;
        cursor = path.Pop();
        sb.Remove(sb.Length-1,1);
        return true;
    }
}
