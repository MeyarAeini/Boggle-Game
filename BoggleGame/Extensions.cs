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
}