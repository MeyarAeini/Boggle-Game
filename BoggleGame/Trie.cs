namespace BoggleGame;

internal class Trie
{
    public TrieNode Root { get; private set; }  
    public Trie(IEnumerable<string> dictionary)
    {
        Root = new TrieNode();        
        foreach(var str in dictionary){
            var value = str.Replace(Constants.QuValue,Constants.QU.ToString());
            int i=0;
            var cursor = Root;
            while(i<value.Length){
                cursor = cursor.FindOrAdd(value[i]);
                i++;              
            }
            cursor.MarkAsLeaf();
        }
    }

    public bool ContainsKey(string s){
        int i =0;
        var cursor = Root;
        while(i < s.Length && cursor != null){
            if(s.IsQu(i))
            {
                cursor = cursor.FindOrAdd(Constants.QU);
                i+=2;
            }
            else
            {
                cursor = cursor.Find(s[i]);
                i++;
            }
        }
        return i == s.Length && cursor != null &&  cursor.IsLeaf;
    }
    public TrieSearchSession OpenSearchSession()=>new TrieSearchSession(Root);

    public override string ToString()
    {
        return Root.ToString();
    }
}
