namespace BoggleGame;

internal static class Extensions
{
    public static bool IsQu(this string str, int index)
    {
        if(string.IsNullOrEmpty(str))
            return false;
        if(index >= str.Length - 1)
            return false;
        
        return (str[index] == 'Q' || str[index]=='q') && (str[index+1] == 'u' || str[index+1] == 'u');
    }

    public static string translateQ(this string str)
    {
        char[] word = new char[str.Length*2];
        int j=0;
        for(int i=0;i<str.Length;i++){
            if(str[i]==Constants.QU)
            {
                word[j++] = Constants.QuValue[0];
                word[j++] = Constants.QuValue[1];
            }
            else{
                word[j++] = str[i];
            }
        }
        return new string(word,0,j);
    }
}