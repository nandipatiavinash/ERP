import re

with open(r'c:\Users\nandi\Downloads\polymer-fabric-erp (2)\polymer-fabric-erp\supabase\migrations\001_initial_schema.sql', 'r', encoding='utf-8') as f:
    content = f.read()

# Search for any function definition containing "has_permission"
pattern = re.compile(r'create\s+(?:or\s+replace\s+)?function\s+(?:\w+\.)?has_permission\b', re.IGNORECASE)
matches = list(pattern.finditer(content))

if matches:
    for m in matches:
        # print the next 200 characters of the match
        print("FOUND FUNCTION DEFINITION:")
        print(content[m.start():m.start()+300])
else:
    print("NO FUNCTION DEFINITION FOUND IN 001_initial_schema.sql")
