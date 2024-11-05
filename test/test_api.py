import requests
import random
import json
from concurrent import futures
import time
from datetime import datetime
import logging
import os
from typing import Dict, List, Any
from dataclasses import dataclass
from enum import Enum
from requests.sessions import Session
from data.endpoints import endpoints


class UserRole(Enum):
    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    STUDENT = "student"


@dataclass
class AuthConfig:
    """Configuración de autenticación para la API"""
    login_endpoint: str
    credentials: Dict[UserRole, Dict[str, str]] = None

    def __post_init__(self):
        if self.credentials is None:
            self.credentials = {
                UserRole.SUPERADMIN: {
                    "email": "isaacamador@gmail.com",
                    "password": "admin"
                },
                UserRole.ADMIN: {
                    "email": "isaacamador2@gmail.com",
                    "password": "admin"
                },
                UserRole.STUDENT: {
                    "email": "isaacamador3@gmail.com",
                    "password": "admin"
                }
            }


class APITester:
    def __init__(self, base_url: str, endpoints: Dict[str, Dict], auth_config: AuthConfig = None):
        """
        Inicializa el tester de API
        
        Args:
            base_url: URL base de la API
            endpoints: Diccionario con la configuración de endpoints a probar
            auth_config: Configuración de autenticación
        """
        self.base_url = base_url.rstrip('/')
        self.endpoints = endpoints
        self.auth_config = auth_config
        self.sessions = {}  # Almacena sesiones por rol
        
        # Crear la carpeta 'logs' si no existe
        if not os.path.exists('logs'):
            os.makedirs('logs')

        # Configurar logging con un número aleatorio para evitar conflictos de nombre
        random_suffix = random.randint(1000, 9999)
        logging.basicConfig(
            filename=os.path.join('logs', f'api_test_{datetime.now().strftime("%Y%m%d_%H%M%S")}_{random_suffix}.log'),
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)

    def get_session(self, role: UserRole) -> Session:
        """
        Obtiene una sesión autenticada para el rol especificado
        """
        if role not in self.sessions:
            session = requests.Session()
            
            if self.auth_config:
                login_url = f"{self.base_url}{self.auth_config.login_endpoint}"
                credentials = self.auth_config.credentials[role]
                
                try:
                    response = session.post(login_url, json=credentials)
                    response.raise_for_status()
                    self.logger.info(f"Login exitoso para rol {role}. Cookies: {session.cookies.get_dict()}")
                except Exception as e:
                    self.logger.error(f"Error en login para rol {role}: {str(e)}")
                    raise
                
            self.sessions[role] = session
            
        return self.sessions[role]

    def make_request(self, endpoint: str, data: Dict, role: UserRole) -> Dict:
        """
        Realiza una petición individual a la API
        """
        endpoint_config = self.endpoints[endpoint]
        url = f"{self.base_url}{endpoint_config['path']}"
        method = endpoint_config['method'].upper()
        
        session = self.get_session(role)
        
        start_time = time.time()
        try:
            request_kwargs = {
                'timeout': 30
            }
            
            if method == 'GET':
                request_kwargs['params'] = data
            else:
                request_kwargs['json'] = data
            
            response = session.request(method, url, **request_kwargs)
            elapsed_time = time.time() - start_time
            
            result = {
                'endpoint': endpoint,
                'method': method,
                'url': url,
                'data': data,
                'role': role.value,
                'status_code': response.status_code,
                'response_time': elapsed_time,
                'response_body': response.json() if response.text else None,
                'cookies': dict(session.cookies.items())
            }
            
            self.logger.info(f"Request completada: {json.dumps(result, indent=2)}")
            return result
            
        except Exception as e:
            self.logger.error(f"Error en request: {endpoint} - {str(e)}")
            return {
                'endpoint': endpoint,
                'error': str(e),
                'data': data,
                'role': role.value
            }

    def run_tests(self, num_requests: int = 100, use_threads: bool = True, roles: List[UserRole] = None) -> List[Dict]:
        """
        Ejecuta las pruebas en los endpoints configurados
        """
        all_results = []
        roles = roles or list(UserRole)
        
        for role in roles:
            self.get_session(role)
        
        for endpoint, config in self.endpoints.items():
            data = config['data']
            
            requests_to_make = []
            for _ in range(num_requests):
                role = random.choice(roles)
                data_item = random.choice(data)  # Cambié 'data' a 'data_item' para evitar confusiones
                requests_to_make.append((endpoint, data_item, role))
            
            if use_threads:
                with futures.ThreadPoolExecutor(max_workers=10) as executor:
                    future_to_request = {
                        executor.submit(self.make_request, endpoint, data_item, role): (endpoint, data_item, role)
                        for endpoint, data_item, role in requests_to_make
                    }
                    for future in futures.as_completed(future_to_request):
                        try:
                            result = future.result()
                            all_results.append(result)
                        except Exception as e:
                            self.logger.error(f"Error en request: {str(e)}")
            else:
                results = [
                    self.make_request(endpoint, data_item, role)
                    for endpoint, data_item, role in requests_to_make
                ]
                all_results.extend(results)
        
        return all_results

    def generate_report(self, results: List[Dict]) -> Dict:
        """
        Genera un reporte con estadísticas de las pruebas
        """
        report = {
            'total_requests': len(results),
            'successful_requests': len([r for r in results if 'error' not in r]),
            'failed_requests': len([r for r in results if 'error' in r]),
            'endpoints': {}
        }
        
        for endpoint in self.endpoints.keys():
            endpoint_results = [r for r in results if r['endpoint'] == endpoint]
            
            report['endpoints'][endpoint] = {
                'total_requests': len(endpoint_results),
                'by_role': {},
                'average_response_time': None,
                'status_codes': {}
            }
            
            for role in UserRole:
                role_results = [r for r in endpoint_results if r.get('role') == role.value]
                data_results = [r for r in role_results if r['data']]
                
                report['endpoints'][endpoint]['by_role'][role.value] = {
                    'total_requests': len(role_results),
                    'status_codes': {}
                }
                
                for result in role_results:
                    if 'status_code' in result:
                        status_code = str(result['status_code'])
                        report['endpoints'][endpoint]['by_role'][role.value]['status_codes'][status_code] = \
                            report['endpoints'][endpoint]['by_role'][role.value]['status_codes'].get(status_code, 0) + 1
            
            response_times = [
                r['response_time'] 
                for r in endpoint_results 
                if 'response_time' in r
            ]
            if response_times:
                report['endpoints'][endpoint]['average_response_time'] = sum(response_times) / len(response_times)
        
        self.logger.info(f"Reporte generado: {json.dumps(report, indent=2)}")
        return report


# Ejemplo de uso
auth_config = AuthConfig(
    login_endpoint="/api/auth/login"
)

tester = APITester(
    base_url="http://localhost:3000",  
    endpoints=endpoints,
    auth_config=auth_config
)

# Ejecutar pruebas
resultados = tester.run_tests(
    num_requests=10,
    use_threads=True,
    roles=[UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.STUDENT]
)

# Generar reporte
reporte = tester.generate_report(resultados)
print(json.dumps(reporte, indent=2))
