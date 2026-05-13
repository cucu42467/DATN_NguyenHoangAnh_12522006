using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

public class SwaggerFileOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var hasFormFile = context.ApiDescription.ParameterDescriptions
            .Any(p => p.Type == typeof(IFormFile) || typeof(IFormFile).IsAssignableFrom(p.Type));

        if (!hasFormFile)
            return;

        // Clear existing content and set multipart/form-data
        operation.RequestBody = new OpenApiRequestBody
        {
            Content = new Dictionary<string, OpenApiMediaType>
            {
                ["multipart/form-data"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties = context.ApiDescription.ParameterDescriptions
                            .Where(p => p.Source.Id == "Form" || p.Source.Id == "FormFile")
                            .ToDictionary(
                                p => p.Name ?? string.Empty,
                                p => GetOpenApiSchema(p.Type))
                    }
                }
            }
        };
    }

    private static OpenApiSchema GetOpenApiSchema(Type type)
    {
        if (type == typeof(IFormFile) || typeof(IFormFile).IsAssignableFrom(type))
        {
            return new OpenApiSchema
            {
                Type = "string",
                Format = "binary"
            };
        }

        if (type == typeof(int) || type == typeof(int?))
            return new OpenApiSchema { Type = "integer", Format = "int32" };

        if (type == typeof(long) || type == typeof(long?))
            return new OpenApiSchema { Type = "integer", Format = "int64" };

        if (type == typeof(bool) || type == typeof(bool?))
            return new OpenApiSchema { Type = "boolean" };

        if (type == typeof(double) || type == typeof(double?))
            return new OpenApiSchema { Type = "number", Format = "double" };

        if (type == typeof(float) || type == typeof(float?))
            return new OpenApiSchema { Type = "number", Format = "float" };

        if (type == typeof(DateTime) || type == typeof(DateTime?))
            return new OpenApiSchema { Type = "string", Format = "date-time" };

        return new OpenApiSchema { Type = "string" };
    }
}
