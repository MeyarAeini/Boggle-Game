namespace BoggleGame;

internal class Trie
{
    TrieNode root;  
    public Trie(IEnumerable<string> dictionary)
    {
        root = new TrieNode();        
        foreach(var str in dictionary){
            var value = str.Replace(Constants.QuValue,Constants.QU.ToString());
            int i=0;
            var cursor = root;
            while(i<value.Length){
                cursor = cursor.FindOrAdd(value[i]);
                i++;              
            }
            cursor.MarkAsLeaf();
        }
    }

    public bool ContainsKey(string s){
        int i =0;
        var cursor = root;
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
    public TrieSearchSession OpenSearchSession()=>new TrieSearchSession(root);

    public override string ToString()
    {
        return root.ToString();
    }
}
