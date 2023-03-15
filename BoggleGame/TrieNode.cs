namespace BoggleGame;

using System.Text;

internal class TrieNode
{
    const char LF = '~';
    char ch;
    public TrieNode(){
        index = new Dictionary<char, TrieNode>();
    }
    public bool IsLeaf => index.ContainsKey(LF);
    private TrieNode(char cha)
    {
        ch = cha;
        index = new Dictionary<char, TrieNode>();
    }
    public TrieNode FindOrAdd(char ch){
        if(index.TryGetValue(ch,out var tn)){
            return tn;
        }
        index.Add(ch,new TrieNode(ch));
        return index[ch];
    }
    public TrieNode? Find(char ch){
        if(index.TryGetValue(ch,out var tn)){
            return tn;
        }
        return null;
    }
    public void MarkAsLeaf(){
        if(!index.TryGetValue(LF,out var tn)){
            index.Add(LF,null);
        }
    }
    
    public bool FindWord(string word)
    {
        var c = AnyStartWith(word);
        return c.Item2;
    }

    public (bool,bool) AnyStartWith(string prefix)
    {
        var c = GoTo(prefix);
        return (c != null ,c != null && c.IsLeaf);
    }

    private TrieNode? GoTo(string word)
    {
        var c = this;
        for(int i=0;i<word.Length;i++)
        {
            c = c.Find(word[i]);
            if(c==null)
            {
                return c;
            }
        }
        return c;
    }
    Dictionary<char,TrieNode> index;
    public override string ToString()
    {
        List<string> lst = new List<string>();
        StringBuilder sb = new StringBuilder();
        travers(this,lst,sb);
        return string.Join(' ',lst);
    }
    private void travers(TrieNode node,List<string> lst, StringBuilder sb){
        if(node.index == null) return;
        if(node.IsLeaf){
            lst.Add(sb.ToString());
        }  
        foreach(var nd in node.index){                        
            if(nd.Key==LF) continue;            
            sb.Append(nd.Key);                      
            travers(nd.Value,lst,sb);
        }
        if(sb.Length>0)
        sb.Remove(sb.Length-1,1);
    }
}
