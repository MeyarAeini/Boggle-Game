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
    static Random Rand = new Random(17);
    // letters and frequencies of letters in the English alphabet
    public static readonly string ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    public static readonly double[] FREQUENCIES = {
        0.08167, 0.01492, 0.02782, 0.04253, 0.12703, 0.02228,
        0.02015, 0.06094, 0.06966, 0.00153, 0.00772, 0.04025,
        0.02406, 0.06749, 0.07507, 0.01929, 0.00095, 0.05987,
        0.06327, 0.09056, 0.02758, 0.00978, 0.02360, 0.00150,
        0.01974, 0.00074
    };

    private static readonly double[] FREQUENCIES_INTERVALS;

    private char[][] board;
    static BoggleBoard()
    {
        FREQUENCIES_INTERVALS = new double[FREQUENCIES.Length];
        for(int i=0;i<FREQUENCIES.Length;i++){
            if(i==0)
                FREQUENCIES_INTERVALS[i] = FREQUENCIES[i];
            else
                FREQUENCIES_INTERVALS[i] = FREQUENCIES_INTERVALS[i-1] + FREQUENCIES[i];
        }
    }

    // Initializes a random 4-by-4 Boggle board.
    // (by rolling the Hasbro dice)
    public BoggleBoard() 
    {
        var dice = BOGGLE_1992;
        switch(Rand.Next(3))
        {
            case 0 : dice = BOGGLE_1992; break;
            case 1 : dice = BOGGLE_1983; break;
            case 2 : dice = BOGGLE_MASTER; break;
            case 3 : dice = BOGGLE_BIG; break;
        }
        initByRollingHasbroDice(4, 4, dice);
    }

    // Initializes a random m-by-n Boggle board.
    // (using the frequency of letters in the English language)
    public BoggleBoard(int m, int n){
        initBoard(m, n);
        for(int i=0;i<rows;i++)
        {
            for(int j=0;j<cols;j++)
            {
                var character = GetNextRandomChar();
                board[i][j] = character == 'Q' ? Constants.QU : character;
            }
        }
    }

    public static char GetNextRandomChar()
    {
        var num = Rand.NextDouble();
        if(num<0.0 || num>1.0) throw new Exception("Out of range");
        int i = 0;
        int j = FREQUENCIES.Length-1;
        int k = (i+j)/2;
        while(i<j)
        {
            if(i==j)
            {
                return ALPHABET[j];
            }
            else if(j==i+1){
                return num<=FREQUENCIES_INTERVALS[i] ? ALPHABET[i] : ALPHABET[j];
            }
            k = (i+j)/2;
            if(num==FREQUENCIES_INTERVALS[k])
            {
                return ALPHABET[k];
            }
            else if(num>FREQUENCIES_INTERVALS[k])
            {
                i=k;
            }
            else
            {
                j=k;
            }

        }
        return ALPHABET[j];
    }

    // Initializes a Boggle board from the specified filename.
    public BoggleBoard(string filename){
        using(var sr = new StreamReader(filename)){
            var line =  sr.ReadLine();
            if(line==null) 
            {
                board = new char[0][];
                return;
            }
            var dim = line.Split(' ');
            rows = int.Parse(dim[0]);
            cols = int.Parse(dim[1]);
            board = new char[rows][];
            for(int i=0;i<rows;i++){
                line = sr.ReadLine();
                if(line==null) break;
                board[i] = new char[cols];
                int k = 0;
                for(int c=0;c<line.Length && k<cols;c++){
                    if(isValidCharacter(line[c])){
                        board[i][k] = line[c];
                        if(line.IsQu(c)){
                            board[i][k] = Constants.QU;
                            c++;
                        }
                        else{
                            board[i][k] = line[c];
                        }                       
                       k++; 
                    }
                }
            }        
        }
    }

    // Initializes a Boggle board from the 2d char array.
    // (with 'Q' representing the two-letter sequence "Qu")
    public BoggleBoard(char[][] a){
        board = a;
        rows = a.Length;
        if(rows>0)
            cols = a[0].Length;
        for(int i=0;i<rows;i++)
        {
            for(int j=0;j<cols;j++)
            {
                if(board[i][j]=='Q')board[i][j]=Constants.QU;
            }
        }
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
    private bool isValidCharacter(char v)
    {
        return v!=' ' && v!=',';
    }

    private void initByRollingHasbroDice(int m, int n, string[] boggleDices) 
    {
        initBoard(m, n);
        var words = boggleDices.OrderBy(it=>Rand.Next()).ToArray();
        for(int i=0;i<rows;i++){
            for(int j=0;j<cols;j++){
                var word = words[i*rows+j];
                var r = Rand.Next(word.Length-1);
                board[i][j] = word[r];
            }
        }
    }
    
    private void initBoard(int m, int n){
        rows = m;
        cols = n;
        board = new char[rows][];
        for(int k=0;k<rows;k++) board[k] = new char[cols];
    }
    /*
    1- Mersenne primes: These are prime numbers of the form 2^p - 1, where p is also a prime number. Mersenne primes have been extensively studied for their randomness properties 
    and have been used in many cryptographic applications. Some well-known Mersenne primes include 3, 7, 31, and 127.

    2- Sophie Germain primes: These are prime numbers p such that 2p + 1 is also a prime number. Sophie Germain primes are named after the mathematician Sophie Germain and 
    have been used in various cryptographic applications due to their strong cryptographic properties. Some well-known Sophie Germain primes include 23, 89, 113, and 359.

    3- Safe primes: These are prime numbers of the form p = 2q + 1, where q is also a prime number. Safe primes are used in cryptographic applications that require strong security 
    because they are difficult to factor. Some well-known safe primes include 23, 47, 59, and 83.

    4- Generalized Fermat primes: These are prime numbers of the form 2^(2^n) + 1, where n is a non-negative integer. Generalized Fermat primes have good randomness properties and 
    have been used in various cryptographic applications. Some well-known generalized Fermat primes include 5, 17, 257, and 65537.
    */
}