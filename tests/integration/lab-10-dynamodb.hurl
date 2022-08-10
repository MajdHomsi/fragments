# tests/integration/lab-10-dynamodb .hurl

# 1. POST a new text fragment to http://localhost:8080 as an authorized user. The fragment's body should be the string, Hello S3!
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/plain
```Hello S3!```

# 2. The server returns back a 201 created status code and a location header. The location header should be the URL of the new fragment.
HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
# 9 is the length of our fragment data: 'Hello S3!'
jsonpath "$.fragment.size" == 9
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# 3. Try to GET the fragment we just posted by its URL
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# 4. server returns a 200 with the fragment type is text/plain and the fragment data is 'Hello S3!'
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
Content-Length: 84
[Asserts]
body == "{\"status\":\"ok\",\"fragment\":{\"type\":\"Buffer\",\"data\":[72,101,108,108,111,32,83,51,33]}}"

# 5. Delete the fragment using the url as an authorized user
DELETE {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
HTTP/1.1 200

# 6. Try to GET the fragment again using url as an authorized user
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# server returns a 404 since the fragment no longer exists deleted
HTTP/1.1 404
