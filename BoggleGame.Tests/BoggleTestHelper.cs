namespace BoggleGame.Tests;

public class BoggleTestHelper
{
    public static void AssertNotSimilar(BoggleBoard a,BoggleBoard b)
    {
        var limit = (a.rows*a.cols * 5)/8;
        Assert.True(getEqualDicesCount(a,b) <= limit);
    }

    public static void AssertNotEqual(BoggleBoard a,BoggleBoard b)
    {
        Assert.False(getEqualDicesCount(a,b)== a.rows*a.cols);
    }

    private static int getEqualDicesCount(BoggleBoard a,BoggleBoard b){
        int equals=0;
        for(int i=0;i<a.rows;i++)
        {
            for(int j=0;j<a.cols;j++)
                if(a.getLetter(i,j)==b.getLetter(i,j)) equals++;
        }
        return equals;
    }
}