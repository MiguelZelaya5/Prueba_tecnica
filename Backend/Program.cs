using System.Text;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// 1. Registrar Controladores
builder.Services.AddControllers();

// 2. Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 3. Configurar PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 4. Configurar Autenticación JWT
var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "TuSuperClaveSecretaSuperSegura12345!");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "RequisicionesApp",
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// 5. Middleware Pipeline
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 6. Aplicar Migraciones e Inicializar Datos en Runtime
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    string defaultHash = BCrypt.Net.BCrypt.HashPassword("123456");
    var admin = db.Users.FirstOrDefault(u => u.Username == "admin1");

    if (admin == null)
    {
        db.Users.AddRange(
            new User { Username = "admin1", PasswordHash = defaultHash, Role = Role.Administrador },
            new User { Username = "empleado1", PasswordHash = defaultHash, Role = Role.Empleado }
        );
    }
    else
    {
        // Fuerza la actualización de la contraseña para '123456' en la base de datos existente
        admin.PasswordHash = defaultHash;
        var emp = db.Users.FirstOrDefault(u => u.Username == "empleado1");
        if (emp != null) emp.PasswordHash = defaultHash;
    }
    db.SaveChanges();
}

app.Run();