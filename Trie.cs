namespace BoggleGame;

internal class Trie
{
    TrieNode root;  
    public Trie(IEnumerable<string> dictionary)
    {
        root = new TrieNode();        
        foreach(var str in dictionary){
            int i=0;
            var cursor = root;
            while(i<str.Length){
                cursor = cursor.FindOrAdd(str[i]);
                i++;
            }
            cursor.MarkAsLeaf();
        }
    }

    public bool ContainsKey(string s){
        int i =0;
        var cursor = root;
        while(i < s.Length && cursor != null){
            cursor = cursor.Find(s[i]);
            i++;
        }
        return i == s.Length && cursor != null &&  cursor.IsLeaf;
    }
    public TrieSearchSession OpenSearchSession()=>new TrieSearchSession(root);

    public override string ToString()
    {
        return root.ToString();
    }
}
