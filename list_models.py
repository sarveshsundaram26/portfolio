import urllib.request
import json

api_key = "AIzaSyDsoCq5aR8kYB46ifxlwAGg_T6Uc8iip2A"
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode())
    
    with open("full_models.json", "w") as f:
        json.dump(data, f, indent=2)
    print("Full model list saved to full_models.json")
except Exception as e:
    print(f"Error: {e}")
