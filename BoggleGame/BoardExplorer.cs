namespace BoggleGame;
using System.Text;

public class BoardExplorer
{
    //Depth-First Search
    public void ExplorDFS(BoggleBoard board, Func<string,bool> onWord){
        for(int i=0;i<board.rows;i++)
        {
            for(int j=0;j<board.cols;j++)
            {
                bool[,] boardVisit = new bool[board.rows,board.cols];
                char[] currentWord = new char[board.rows*board.cols];
                ExplorDFS(board,boardVisit,currentWord,0,i,j,onWord);
            }
        }
    }

    private void ExplorDFS(BoggleBoard board,bool[,] boardVisit,char[] currentWord, int index,int i,int j, Func<string,bool> onWord)
    {
        currentWord[index]=board.getLetter(i,j);
        boardVisit[i,j] = true;
        index++;
        if(!onWord(new string(currentWord,0,index)))
        {
            return;
        }        
        for(int ip=i-1;ip<i+2;ip++)
        {
            for(int jp=j-1;jp<j+2;jp++)
            {
                if(jp==j && ip==i) continue; //current position
                if(ip<0 || ip>=board.rows || jp<0 || jp>=board.cols) continue;//out of board
                if(boardVisit[ip,jp]) continue;//visited        
                ExplorDFS( board, boardVisit, currentWord,index, ip, jp,onWord);
                boardVisit[ip,jp] = false;                
            }
        }
        index--;
    }

    //Breadth-First Search
    public void ExplorBFS(BoggleBoard board, Action<string> onWord){
        
        for(int i=0;i<board.rows;i++)
        {
            for(int j=0;j<board.cols;j++)
            {
                bool[,] boardVisit = new bool[board.rows,board.cols];
                StringBuilder currentWord = new StringBuilder();
                var q = new Queue<BfsQueueItem>();
                var item = new BfsQueueItem(i,j,new StringBuilder(board.getLetter(i,j)),new bool[board.rows,board.cols]);
                q.Enqueue(item);

                while(q.Count>0)
                {
                    var p = q.Dequeue();
                    onWord(p.word.ToString());
                    p.Visit();
                    for(int r=-1;r<2;r++)
                    {
                        for(int c=-1;c<2;c++)
                        {
                            if(c==0 && r==0) continue; //current position
                            var ip = p.i+r;
                            var jp = p.j+c;
                            if(ip<0 || ip>=board.rows || jp<0 || jp>=board.cols) continue;//out of board
                            if(p.isVisited(ip,jp)) continue;//visited
                            item = p.copy(ip,jp);
                            item.word.Append(board.getLetter(ip,jp));
                            q.Enqueue(item);
                        }
                    }
                }   
            }
        }
    }
    
    record BfsQueueItem(int i,int j,StringBuilder word,bool[,] visits)
    {
        public BfsQueueItem copy(int r,int c) => 
            this with 
            {
                i=r,
                j=c,
                visits=copyVisits(this.visits), 
                word = new StringBuilder(this.word.ToString(), this.word.Length)
            };
        public void Visit()
        {
            visits[i,j] = true;
        }
        public bool isVisited(int r, int c)
        {
            return visits[r,c];
        }
        bool[,] copyVisits(bool[,] visits)
        {
            bool[,] newVisits = new bool[visits.GetLength(0), visits.GetLength(1)];
            Array.Copy(visits, newVisits, visits.Length);   
               
            return newVisits;
        }
    }
}