import re

with open(r'c:\Users\nandi\Downloads\polymer-fabric-erp (2)\polymer-fabric-erp\supabase\migrations\001_initial_schema.sql', 'r', encoding='utf-8') as f:
    content = f.read()

matches = [m.start() for m in re.finditer('has_permission', content, re.IGNORECASE)]
for idx, pos in enumerate(matches):
    start = max(0, pos - 100)
    end = min(len(content), pos + 100)
    snippet = content[start:end]
    if 'function' in snippet.lower() or 'create' in snippet.lower():
        print(f"Match {idx} at position {pos}:")
        print("---")
        print(snippet)
        print("---")
