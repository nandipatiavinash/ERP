import re

with open(r'c:\Users\nandi\Downloads\polymer-fabric-erp (2)\polymer-fabric-erp\supabase\migrations\001_initial_schema.sql', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's search for "table" followed by "permissions" or "role_permissions" in the file, or search for "CREATE TABLE" case-insensitively
# and print 100 characters before and after to see how it is defined.
for m in re.finditer(r'(role_permissions|permissions)', content, re.IGNORECASE):
    # let's look for "create" or "table" near the match
    start = max(0, m.start() - 50)
    end = min(len(content), m.end() + 50)
    snippet = content[start:end]
    if 'table' in snippet.lower() or 'create' in snippet.lower():
        print(f"Match at index {m.start()}: {snippet.replace('\n', ' ')}")
        print("---")
