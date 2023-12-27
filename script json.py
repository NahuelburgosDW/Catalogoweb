import os
import pandas as pd

# Directorio donde se encuentra el archivo Excel
directory = r'D:\catalogoweb'

# Nombre del archivo Excel
excel_file_name = 'pasarajson.xlsx'
excel_file_path = os.path.join(directory, excel_file_name)

if os.path.exists(excel_file_path):
    data = pd.read_excel(excel_file_path)

    # Convertir los datos a formato JSON
    json_data = data.to_json(orient='records')

    # Reemplazar barras diagonales inversas ("\") con barras diagonales normales ("/")
    json_data = json_data.replace("\\\\", "/")

    # Eliminar las barras diagonales inversas restantes
    json_data = json_data.replace("\\", "")

    # Guardar los datos en un archivo JSON
    json_file = 'datos.json'  # Nombre del archivo JSON de salida
    with open(json_file, 'w') as json_file:
        json_file.write(json_data)

    print(f"Se ha creado el archivo '{json_file}' con los datos convertidos desde el archivo Excel en formato JSON.")
else:
    print("El archivo Excel no se encontró en el directorio especificado.")
