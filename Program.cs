// See https://aka.ms/new-console-template for more information

using BoggleGame;

string filePath = @"C:\Code\C#\BoggleGame\files\";

var boggleSolver = new BoggleSolver($"{filePath}dictionary-algs4.txt");

// List<string> dictionary = new List<string>();
//         using(var sr = new StreamReader($"{filePath}dictionary-algs4.txt")){
//             string? line;
//             while((line=sr.ReadLine())!=null){
//                 dictionary.Add(line);
//             }
//             sr.Close();
//         }
// var trie = new Trie(dictionary);

var board = new BoggleBoard($"{filePath}board-points777.txt");
//Console.Write(board.ToString());

var words = boggleSolver.getAllValidWords(board);

foreach(var word in words){
    Console.Write(word + " ");
}
