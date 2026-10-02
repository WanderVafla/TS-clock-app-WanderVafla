# Labels CRUD — simplified contract copy (see backend/tests/contract/ for the full suite).
# Run: hurl --test --variable base_url=http://localhost:8000 labels.hurl

# 1. Create
POST {{base_url}}/labels
Content-Type: application/json
{"name": "hurl-label-1"}
HTTP 201
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.name" == "hurl-label-1"
jsonpath "$.data.id" isNumber
[Captures]
label_id: jsonpath "$.data.id"

# 2. List contains it
GET {{base_url}}/labels
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data[*].name" contains "hurl-label-1"

# 3. Update, id as number
PATCH {{base_url}}/labels
Content-Type: application/json
{"id": {{label_id}}, "name": "hurl-label-2"}
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.name" == "hurl-label-2"

# 4. Update, id as string
PATCH {{base_url}}/labels
Content-Type: application/json
{"id": "{{label_id}}", "name": "hurl-label-3"}
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.name" == "hurl-label-3"

# 5. Update, bad id -> error shape
PATCH {{base_url}}/labels
Content-Type: application/json
{"id": "abc", "name": "x"}
HTTP *
[Asserts]
status >= 400
status < 500
header "Content-Type" contains "application/json"
jsonpath "$.success" == false
jsonpath "$.name" exists
jsonpath "$.message" exists

# 6. Update, id only -> 4xx Nothing to update
PATCH {{base_url}}/labels
Content-Type: application/json
{"id": "{{label_id}}"}
HTTP *
[Asserts]
status >= 400
status < 500
jsonpath "$.success" == false

# 7. Create, empty name -> 4xx
POST {{base_url}}/labels
Content-Type: application/json
{"name": ""}
HTTP *
[Asserts]
status >= 400
status < 500
jsonpath "$.success" == false

# 8. Delete, bad id -> error shape
DELETE {{base_url}}/labels?id=abc
HTTP *
[Asserts]
status >= 400
status < 500
header "Content-Type" contains "application/json"
jsonpath "$.success" == false
jsonpath "$.name" exists
jsonpath "$.message" exists

# 9. Delete, missing id -> 404 body
DELETE {{base_url}}/labels?id=900000001
HTTP *
[Asserts]
status >= 400
status < 500
jsonpath "$.success" == false
jsonpath "$.name" == "NotFoundError"

# 10. Delete valid -> envelope (cleanup)
DELETE {{base_url}}/labels?id={{label_id}}
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.id" == {{label_id}}

# 11. NUL byte -> must be 4xx. CURRENTLY RED (500, see ../contract/REPORT.md F1).
POST {{base_url}}/labels
Content-Type: application/json
{"name": "ab\u0000cd"}
HTTP *
[Asserts]
status >= 400
status < 500
jsonpath "$.success" == false
