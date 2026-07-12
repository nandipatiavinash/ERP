import re
import glob

pattern = re.compile(r'create\s+table\s+(?:if\s+not\s+exists\s+)?([\w.]+)\b', re.IGNORECASE)

for filepath in glob.glob(r'c:\Users\nandi\Downloads\polymer-fabric-erp (2)\polymer-fabric-erp\**\*.sql', recursive=True):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    matches = list(pattern.finditer(content))
    if matches:
        print(f"File {filepath}:")
        for m in matches:
            print("  ", m.group(0))
