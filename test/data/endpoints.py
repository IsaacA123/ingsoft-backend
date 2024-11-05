import os
import json
import random
from typing import Dict, List, Any, Union


# Funciones para cargar los datos desde JSON
def load_json_data(file_path: str) -> List[Dict[str, str]]:
    with open(file_path, 'r') as f:
        return json.load(f)

# Cargar los datos en la configuración del endpoint
data = load_json_data(os.path.join('data', f'user_data.json'))
endpoints = {
    "crear_administrador": {
        "path": "/api/admins",
        "method": "POST",
        "data": data
    },
    "obtener_administrador": {
        "path": "/api/admins",
        "method": "GET",
        "data": data
    },
    "obtener_un_administrador": {
        "path": f"/api/admins/{random.randint(1, 100)}",
        "method": "GET",
        "data": data
    },
    "eliminar_un_administrador": {
        "path": f"/api/admins/{random.randint(1, 100)}",
        "method": "DELETE",
        "data": data
    }
}