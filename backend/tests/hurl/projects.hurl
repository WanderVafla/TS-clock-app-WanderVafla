# Projects CRUD — simplified contract copy (see backend/tests/contract/ for the full suite).
# Run: hurl --test --variable base_url=http://localhost:8000 projects.hurl
# Note: DELETE /projects returns {id} only (see ../contract/REPORT.md F2/D4);
# these entries assert the actual shape until decision 3.2 is resolved.

# 1. Create
POST {{base_url}}/projects
Content-Type: application/json
{"name": "hurl-project-1"}
HTTP 201
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.name" == "hurl-project-1"
jsonpath "$.data.id" isNumber
jsonpath "$.data.created_at" exists
[Captures]
project_id: jsonpath "$.data.id"

# 2. List contains it
GET {{base_url}}/projects
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data[*].name" contains "hurl-project-1"

# 3. Update, id as number
PATCH {{base_url}}/projects
Content-Type: application/json
{"id": {{project_id}}, "name": "hurl-project-2"}
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.name" == "hurl-project-2"

# 4. Update, id as string
PATCH {{base_url}}/projects
Content-Type: application/json
{"id": "{{project_id}}", "name": "hurl-project-3"}
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.name" == "hurl-project-3"

# 5. Update, bad id -> error shape
PATCH {{base_url}}/projects
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
PATCH {{base_url}}/projects
Content-Type: application/json
{"id": "{{project_id}}"}
HTTP *
[Asserts]
status >= 400
status < 500
jsonpath "$.success" == false

# 7. Create, empty name -> 4xx
POST {{base_url}}/projects
Content-Type: application/json
{"name": ""}
HTTP *
[Asserts]
status >= 400
status < 500
jsonpath "$.success" == false

# 8. Delete, bad id -> error shape
DELETE {{base_url}}/projects?id=abc
HTTP *
[Asserts]
status >= 400
status < 500
header "Content-Type" contains "application/json"
jsonpath "$.success" == false
jsonpath "$.name" exists
jsonpath "$.message" exists

# 9. Delete, missing id -> 404 body
DELETE {{base_url}}/projects?id=900000001
HTTP *
[Asserts]
status >= 400
status < 500
jsonpath "$.success" == false
jsonpath "$.name" == "NotFoundError"

# 10. Delete valid -> envelope (cleanup)
DELETE {{base_url}}/projects?id={{project_id}}
HTTP 200
[Asserts]
jsonpath "$.success" == true
jsonpath "$.data.id" == {{project_id}}

# 11. NUL byte -> must be 4xx. CURRENTLY RED (500, see ../contract/REPORT.md F1).
POST {{base_url}}/projects
Content-Type: application/json
{"name": "ab\u0000cd"}
HTTP *
[Asserts]
status >= 400
status < 500
jsonpath "$.success" == false
