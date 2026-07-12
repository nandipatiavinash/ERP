import re
import glob

pattern = re.compile(r'create\s+(?:or\s+replace\s+)?function\s+(?:\w+\.)?has_permission\b', re.IGNORECASE)

for filepath in glob.glob(r'c:\Users\nandi\Downloads\polymer-fabric-erp (2)\polymer-fabric-erp\**\*.sql', recursive=True):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    matches = list(pattern.finditer(content))
    if matches:
        print(f"Found in {filepath}:")
        for m in matches:
            print(content[m.start():m.start()+400])
            print("---")
