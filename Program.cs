// See https://aka.ms/new-console-template for more information

using BoggleGame;

string filePath = @"C:\Code\C#\BoggleGame\files\";

var boggleSolver = new BoggleSolver($"{filePath}dictionary-2letters.txt");

List<string> dictionary = new List<string>();
        using(var sr = new StreamReader($"{filePath}dictionary-2letters.txt")){
            string? line;
            while((line=sr.ReadLine())!=null){
                dictionary.Add(line);
            }
            sr.Close();
        }
var trie = new Trie(dictionary);

var board = new BoggleBoard($"{filePath}board-couscous.txt");

var words = boggleSolver.getAllValidWords(board);

foreach(var word in words){
    Console.Write(word + " ");
}
