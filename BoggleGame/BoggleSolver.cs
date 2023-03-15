namespace BoggleGame;

using BoggleGame.Dto;
public class BoggleSolver
{
    Trie index;
    
    // Initializes the data structure using the given array of strings as the dictionary.
    // (You can assume each word in the dictionary contains only the uppercase letters A through Z.)
    public BoggleSolver(string[] dictionary)
    {
        index = GetIndex(dictionary); 
    }
    public BoggleSolver(string fileName)
    {
        List<string> dictionary = new List<string>();
        using(var sr = new StreamReader(fileName)){
            string? line;
            while((line=sr.ReadLine())!=null){
                dictionary.Add(line);
            }
            sr.Close();
        }
        index = GetIndex(dictionary); 
    }
    private Trie GetIndex(IEnumerable<string> dictionary){
        if(dictionary==null) return new Trie(new string[]{});
        return new Trie(dictionary); 
    }
    // Returns the set of all valid words in the given Boggle board, as an Iterable.
    public IEnumerable<BoggleGamePath> getAllValidPaths(BoggleBoard board)
    {
        List<BoggleGamePath> result = new List<BoggleGamePath>();        
        int k = 0;
        for(int i=0;i<board.rows;i++){
            for(int j=0;j<board.cols;j++){
                var path = new BoggleBoardPath(board);
                var search = index.OpenSearchSession();
                var lst = Search(search,path,i,j);
                if(lst==null) continue;
                result.AddRange(lst);
            }
        }
        return result;
    }

    // Returns the set of all valid words in the given Boggle board, as an Iterable.
    public Dictionary<string,HashSet<WordPath>> getAllValidWordWithPaths(BoggleBoard board)
    {
        var result = new Dictionary<string,HashSet<WordPath>>();    
        var path = new BoggleBoardPath(board); 
        // index.Root.FindWord("SCORE");
        // return result;
        for(int i=0;i<board.rows;i++){
            for(int j=0;j<board.cols;j++){                
                Search(result,path,i,j);
                path.CleanUp();
            }
        }
        return result;
    }

    public IEnumerable<string> getAllValidWords(BoggleBoard board)
    {
        var words = new Dictionary<string,int>(); 
        var notWords = new HashSet<string>();
        var explorer = new BoardExplorer();
        System.Diagnostics.Stopwatch sw = new System.Diagnostics.Stopwatch();
        sw.Start();
        explorer.ExplorDFS(board, it => {            
            if(notWords.Contains(it)) return false; //already checked , it does not exist.
            if(words.ContainsKey(it)) { // already checked it does exist as complete word
                words[it]++;
                return true;
            }
            var exist = index.Root.AnyStartWith(it);
            if(!exist.Item1){ // could not find any word with this prefix
                notWords.Add(it);
                return false;
            }
            if(exist.Item2) // it is complete word, add to the result
                words.Add(it,1);
            return true;
        });
       Console.WriteLine($"{sw.ElapsedMilliseconds/1000} - {words.Count}");
       Console.WriteLine(words.Keys.Sum(it=>scoreOf(it.Replace(Constants.QU.ToString(),Constants.QuValue))));
       return words.Keys.Select(it=>it.Replace(Constants.QU.ToString(),Constants.QuValue));
    }

    // Returns the score of the given word if it is in the dictionary, zero otherwise.
    // (You can assume the word contains only the uppercase letters A through Z.)
    public int scoreOf(string word)
    {
        if(string.IsNullOrEmpty(word)){
            return 0;
        }
        int length=0;
        for(int i=0;i<word.Length;i++){
            if(word.IsQu(i)){
                i++;
            }
            length++;
        }

        switch(length)
        {
            case <3 : return 0;
            case <5 : return 1;
            case 5 : return 2;
            case 6 : return 3;
            case 7 : return 5;
            case >7 : return 11;
        }
    }
    
    private IEnumerable<BoggleGamePath>? Search(TrieSearchSession session,BoggleBoardPath path,int row, int column)
    {
        if(!path.Push(row,column))
        {
            //no move
            return null;
        }

        if(!session.MoveForward(path.Top())){
            path.Pop(); //go back to the original place since this path does not exist in the dictionary
            return null;
        }   
        List<BoggleGamePath> result = new List<BoggleGamePath>();

        if(session.IsaWord && session.Word.Length>=2)
        {
            result.Add(new BoggleGamePath(session.Word,path.GetPath()));
        }
        for(int k=-1;k<2;k++){
            for(int l=-1;l<2;l++){
                
                if(l==0 && k==0) continue;

                var subResult = Search(session,path,row+k, column+l);
                if(subResult!=null){
                    result.AddRange(subResult);
                }
                
                var stepBacks = path.ReturnTo(row,column);                
                while(stepBacks>0){
                    session.Back();
                    stepBacks--;
                }            
            }
        }         
        return result;
    }
    private void Search(IDictionary<string,HashSet<WordPath>> result,BoggleBoardPath path,int row, int column)
    {
        if(!path.Push(row,column))
        {
            //no move
            return ;
        }
        var word = path.GetWord();
        var tword = word.Replace(Constants.QU.ToString(),Constants.QuValue);
        
        if(result.TryGetValue(tword ,out var existinWordPaths))
        {
            existinWordPaths.Add(new WordPath(path.GetPath()));
        }
        else
        {      
            if(!index.Root.FindWord(word)){
                //path.Pop(); //go back to the original place since this path does not exist in the dictionary
                return;
            }
            result.Add(tword,new HashSet<WordPath>(){new WordPath(path.GetPath())});
        }
        
        for(int k=-1;k<2;k++){
            for(int l=-1;l<2;l++){                
                if(l==0 && k==0) continue;               
                Search(result,path,row+k, column+l);                
                path.ReturnTo(row,column);
            }
        }        
    }

    private void Search(HashSet<string> result,BoggleBoardPath path,int row, int column)
    {
        if(!path.Push(row,column))
        {
            //no move
            return ;
        }
        var word = path.GetWord();
        var tword = word.Replace(Constants.QU.ToString(),Constants.QuValue);
        
        if(!result.TryGetValue(tword ,out var existinWordPaths))
        {
            if(!index.Root.FindWord(word)){
                //path.Pop(); //go back to the original place since this path does not exist in the dictionary
                return;
            }
            result.Add(tword);
        }
        else{
        }
        
        for(int k=-1;k<2;k++){
            for(int l=-1;l<2;l++){                
                if(l==0 && k==0) continue;               
                Search(result,path,row+k, column+l);                
                path.ReturnTo(row,column);
            }
        }        
    }
}
