
const string  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                builder =>
                                {
                                    builder.WithOrigins("http://localhost:5079")
                                                        .AllowAnyHeader()
                                                        .AllowAnyMethod();
                                });
            });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseHttpsRedirection();

app.UseAuthorization();
app.UseCors(MyAllowSpecificOrigins);
app.MapControllers();


// string path = @"..\BoggleGame\files\";

// var boggleSolver = new BoggleGame.BoggleSolver($"{path}dictionary-yawl.txt");
// var board = new BoggleGame.BoggleBoard($"{path}board-points26539.txt");
//  boggleSolver.getAllValidWords(board);

app.Run();
