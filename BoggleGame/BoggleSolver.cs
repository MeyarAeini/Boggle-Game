using System.Globalization;

namespace BoggleGame;

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
    public IEnumerable<BoggleGamePath> getAllValidWords(BoggleBoard board)
    {
        List<BoggleGamePath> result = new List<BoggleGamePath>();        
        for(int i=0;i<board.rows;i++){
            for(int j=0;j<board.cols;j++){
                var path = new BoggleBoardPath(board);
                var search = index.OpenSearchSession();
                var lst = Search(search,path,i,j);
                if(lst==null) return result;
                result.AddRange(lst);
            }
        }
        return result;
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
                if(subResult==null){
                    continue;//not move has been hapened or cursor has moved back to the original place
                }
                
                result.AddRange(subResult);
                var stepBacks = path.ReturnTo(row,column);
                while(stepBacks>0){
                    session.Back();
                    stepBacks--;
                }            
            }
        }         
        return result;
    }

}
