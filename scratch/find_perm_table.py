import re

with open(r'c:\Users\nandi\Downloads\polymer-fabric-erp (2)\polymer-fabric-erp\supabase\migrations\001_initial_schema.sql', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'create\s+table\s+(?:public\.)?permissions\b', re.IGNORECASE)
matches = list(pattern.finditer(content))
for m in matches:
    print("Found table creation:")
    print(content[m.start():m.start()+300])
    print("---")
