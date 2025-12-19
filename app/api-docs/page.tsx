export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            📚 Documentación de API
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            API REST para interactuar con modelos de Ollama a través de tu aplicación.
          </p>
        </div>

        {/* Autenticación */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            🔐 Autenticación
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Todas las peticiones requieren un token de autenticación en el header Authorization:
          </p>
          <div className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto border border-gray-700">
            <code className="text-green-400 text-sm">
              Authorization: Bearer tu_token_secreto_aqui
            </code>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 rounded">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>⚠️ Importante:</strong> Configura tu token en el archivo{" "}
              <code className="bg-yellow-100 dark:bg-yellow-800/30 px-2 py-1 rounded">.env.local</code> con la variable{" "}
              <code className="bg-yellow-100 dark:bg-yellow-800/30 px-2 py-1 rounded">API_TOKEN</code>
            </p>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          {/* GET /api/models */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-500 text-white px-3 py-1 rounded font-mono text-sm font-bold">
                GET
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">/api/models</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Obtiene la lista de modelos disponibles en Ollama.
            </p>
            
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Respuesta exitosa (200):</h4>
            <div className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto mb-4 border border-gray-700">
              <pre className="text-green-400 text-sm">
{`{
  "models": [
    {
      "name": "llama2:latest",
      "modified_at": "2024-03-20T10:30:00Z",
      "size": 3826793677,
      "digest": "sha256:...",
      "details": {
        "format": "gguf",
        "family": "llama",
        "families": ["llama"],
        "parameter_size": "7B",
        "quantization_level": "Q4_0"
      }
    }
  ]
}`}
              </pre>
            </div>

            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ejemplo con curl:</h4>
            <div className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto border border-gray-700">
              <code className="text-blue-400 text-sm">
{`curl -X GET http://localhost:3000/api/models \\
  -H "Authorization: Bearer tu_token_secreto"`}
              </code>
            </div>
          </div>

          {/* POST /api/chat */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-500 text-white px-3 py-1 rounded font-mono text-sm font-bold">
                POST
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">/api/chat</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Envía mensajes al modelo y obtiene una respuesta.
            </p>
            
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Parámetros del body:</h4>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Parámetro
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Requerido
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Descripción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-100">messages</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Array</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Sí</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      Lista de mensajes con role y content
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-100">model</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">String</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Sí</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      Nombre del modelo a utilizar
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ejemplo de petición:</h4>
            <div className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto mb-4 border border-gray-700">
              <pre className="text-green-400 text-sm">
{`{
  "model": "llama2",
  "messages": [
    {
      "role": "user",
      "content": "¿Qué es la inteligencia artificial?"
    }
  ]
}`}
              </pre>
            </div>

            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Respuesta exitosa (200):</h4>
            <div className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto mb-4 border border-gray-700">
              <pre className="text-green-400 text-sm">
{`{
  "message": "La inteligencia artificial es..."
}`}
              </pre>
            </div>

            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ejemplo con curl:</h4>
            <div className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto border border-gray-700">
              <code className="text-blue-400 text-sm">
{`curl -X POST http://localhost:3000/api/chat \\
  -H "Authorization: Bearer tu_token_secreto" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama2",
    "messages": [
      {"role": "user", "content": "Hola"}
    ]
  }'`}
              </code>
            </div>
          </div>

          {/* POST /api/models/pull */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-500 text-white px-3 py-1 rounded font-mono text-sm font-bold">
                POST
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">/api/models/pull</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Descarga un nuevo modelo en Ollama.
            </p>
            
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Parámetros del body:</h4>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Parámetro
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Requerido
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Descripción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-100">model</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">String</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Sí</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      Nombre del modelo a descargar
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ejemplo de petición:</h4>
            <div className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto mb-4 border border-gray-700">
              <pre className="text-green-400 text-sm">
{`{
  "model": "llama2"
}`}
              </pre>
            </div>

            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ejemplo con curl:</h4>
            <div className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto border border-gray-700">
              <code className="text-blue-400 text-sm">
{`curl -X POST http://localhost:3000/api/models/pull \\
  -H "Authorization: Bearer tu_token_secreto" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "llama2"}'`}
              </code>
            </div>
          </div>
        </div>

        {/* Códigos de respuesta */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📊 Códigos de respuesta HTTP</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-3 text-sm font-mono text-green-600 dark:text-green-400 font-bold">200</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Petición exitosa</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono text-yellow-600 dark:text-yellow-400 font-bold">400</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Petición inválida</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono text-red-600 dark:text-red-400 font-bold">401</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No autorizado - Token faltante</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono text-red-600 dark:text-red-400 font-bold">403</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Prohibido - Token inválido</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-mono text-red-600 dark:text-red-400 font-bold">500</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Error interno del servidor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p>¿Necesitas ayuda? Consulta la documentación de Ollama en{" "}
            <a 
              href="https://ollama.ai/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ollama.ai/docs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
