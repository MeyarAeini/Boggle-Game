namespace BoggleGame;

public class Utils
{
    public static bool IsPrime(int x)
    {
        if(x<2)return false;
        if(x<=3) return true;
        if(x%2==0 || x%3==0) return false;
        if(x<=7)return true;
        //Any number n can have only one primefactor greater than Math.Sqrt(n)
        var r = (int)Math.Sqrt(x) + 1;
        //All primes greater than 3 can be written in the form  6k+/-1.
        var i = 5;
        while(i<r){
            if(x%i==0)return false;
            if(x%(i+2)==0)return false;
            i+=6;
        }
        return true;
    }

    public static IEnumerable<int> GetPrimes(int limit)
    {
        bool[] isComposit = new bool[limit+1];
        for(int i=2;i<=limit;i++){
            if(!isComposit[i]){
                yield return i;
                int j=2;
                while((i*j)<limit+1)
                {
                    isComposit[i*j] = true;
                    j++;
                }
            }

        }
    }
}