import subprocess
import time

# Configuración
script_to_run = "test_api.py"  # Reemplaza con el nombre de tu archivo de pruebas
num_instances = 5  # Define cuántas instancias ejecutar
delay_between_starts = 0.1  # Delay entre inicios para evitar que todas se ejecuten exactamente al mismo tiempo

# Ejecuta múltiples instancias del script
processes = []
for _ in range(num_instances):
    process = subprocess.Popen(["python", script_to_run])
    processes.append(process)
    time.sleep(delay_between_starts)

# Espera a que todas las instancias finalicen
for process in processes:
    process.wait()

print("Todas las instancias de prueba han finalizado.")
