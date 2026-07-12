import re

with open(r'c:\Users\nandi\Downloads\polymer-fabric-erp (2)\polymer-fabric-erp\supabase\migrations\001_initial_schema.sql', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find any insert statement on tables like permissions, role_permissions, roles, users.
for m in re.finditer(r'insert\s+into\s+public\.(role_permissions|permissions|roles|users)', content, re.IGNORECASE):
    print("MATCH AT:", m.start())
    print(content[m.start():m.start()+300])
    print("---")
