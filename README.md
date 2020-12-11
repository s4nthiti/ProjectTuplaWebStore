# ProjectTuplaWebStore
this repository made for CPE327 Software Engineer project

This Project using
Angular and .NET CORE 3.1 to run
and MSSQL as Database

for Angular go to Frontend directory and
-> npm install
-> ng serve

for ASP.NET Core go to ContentService.API directory
-> dotnet ef database update 0  //<- to check If your IdentityConnection connected to MSSQL and update database to 0
-> dotnet ef migrations add Initial //<- Initial create migrations
-> dotnet ef database update //<- Update database from migrations Initial

-> dotnet run  //<- Run APP

NO COPYRIGHT 2020
