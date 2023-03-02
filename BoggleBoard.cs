namespace BoggleGame;
using System.Text;
public class BoggleBoard
{
    // the 16 Boggle dice (1992 version)
    private static readonly string[] BOGGLE_1992 = {
        "LRYTTE", "VTHRWE", "EGHWNE", "SEOTIS",
        "ANAEEG", "IDSYTT", "OATTOW", "MTOICU",
        "AFPKFS", "XLDERI", "HCPOAS", "ENSIEU",
        "YLDEVR", "ZNRNHL", "NMIQHU", "OBBAOJ"
    };

    // the 16 Boggle dice (1983 version)
    private static readonly string[] BOGGLE_1983 = {
        "AACIOT", "ABILTY", "ABJMOQ", "ACDEMP",
        "ACELRS", "ADENVZ", "AHMORS", "BIFORX",
        "DENOSW", "DKNOTU", "EEFHIY", "EGINTV",
        "EGKLUY", "EHINPS", "ELPSTU", "GILRUW",
    };

    // the 25 Boggle Master / Boggle Deluxe dice
    private static readonly string[] BOGGLE_MASTER = {
        "AAAFRS", "AAEEEE", "AAFIRS", "ADENNN", "AEEEEM",
        "AEEGMU", "AEGMNN", "AFIRSY", "BJKQXZ", "CCNSTW",
        "CEIILT", "CEILPT", "CEIPST", "DDLNOR", "DHHLOR",
        "DHHNOT", "DHLNOR", "EIIITT", "EMOTTT", "ENSSSU",
        "FIPRSY", "GORRVW", "HIPRRY", "NOOTUW", "OOOTTU"
    };

    // the 25 Big Boggle dice
    private static readonly string[] BOGGLE_BIG = {
        "AAAFRS", "AAEEEE", "AAFIRS", "ADENNN", "AEEEEM",
        "AEEGMU", "AEGMNN", "AFIRSY", "BJKQXZ", "CCENST",
        "CEIILT", "CEILPT", "CEIPST", "DDHNOT", "DHHLOR",
        "DHLNOR", "DHLNOR", "EIIITT", "EMOTTT", "ENSSSU",
        "FIPRSY", "GORRVW", "IPRRRY", "NOOTUW", "OOOTTU"
    };

    // letters and frequencies of letters in the English alphabet
    private static readonly string ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static readonly double[] FREQUENCIES = {
        0.08167, 0.01492, 0.02782, 0.04253, 0.12703, 0.02228,
        0.02015, 0.06094, 0.06966, 0.00153, 0.00772, 0.04025,
        0.02406, 0.06749, 0.07507, 0.01929, 0.00095, 0.05987,
        0.06327, 0.09056, 0.02758, 0.00978, 0.02360, 0.00150,
        0.01974, 0.00074
    };

    private char[][] board;

    // Initializes a random 4-by-4 Boggle board.
    // (by rolling the Hasbro dice)
    public BoggleBoard(){
        rows = 4;
        cols = 4;
        board = new char[rows][];
        for(int k=0;k<rows;k++) board[k] = new char[cols];

        var rnd = new Random();
        var words = BOGGLE_1992.OrderBy(it=>rnd.Next()).ToArray();
        for(int i=0;i<rows;i++){
            for(int j=0;j<cols;j++){
                var word = words[i*rows+j];
                var r = rnd.Next(word.Length-1);
                board[i][j] = word[r];
            }
        }
    }

    // Initializes a random m-by-n Boggle board.
    // (using the frequency of letters in the English language)
    public BoggleBoard(int m, int n){

    }

    // Initializes a Boggle board from the specified filename.
    public BoggleBoard(string filename){
        using(var sr = new StreamReader(filename)){
            var dim = sr.ReadLine().Split(' ');
            rows = int.Parse(dim[0]);
            cols = int.Parse(dim[1]);
            board = new char[rows][];
            for(int i=0;i<rows;i++){
                board[i] = sr.ReadLine().Split(' ').Select(it=>it[0]).ToArray();
            }        
        }
    }

    // Initializes a Boggle board from the 2d char array.
    // (with 'Q' representing the two-letter sequence "Qu")
    public BoggleBoard(char[][] a){

    }

    // Returns the number of rows.
    public int rows{get;private set;}

    // Returns the number of columns.
    public int cols{get;private set;}

    // Returns the letter in row i and column j.
    // (with 'Q' representing the two-letter sequence "Qu")
    public char getLetter(int i, int j) => board[i][j];

    public override string ToString()
    {
        StringBuilder sb = new StringBuilder();
        for(int i=0;i<rows;i++){
            for(int j=0;j<cols;j++){
                sb.Append($" {board[i][j]} ");
            }
            sb.AppendLine();
        }
        return sb.ToString();
    }
}