# Health Check Test
GET http://localhost:8080

# We're getting back an HTTP 1.1 200 response
HTTP/1.1 200

# We're getting back a non-cacheable response
Cache-Control: no-cache

# Extra checks
[Asserts]

# We're getting back a JSON response with { "status": "ok", ... }
jsonpath "$.status" == "ok"

# We're getting back a JSON response with { ..., "author": "..." }
jsonpath "$.author" isString

# We're getting back a JSON response with { ..., "githubUrl": "..." }
jsonpath "$.githubUrl" matches /^https:\/\/github.com\/.+/

# We're getting back a JSON response with { ..., "version": "x.y.z" }
jsonpath "$.version" matches /^\d+\.\d+\.\d+$/
