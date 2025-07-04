import mysql.connector
import pandas as pd

# Configuración base de datos
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'maniydante96',
    'database': 'legajos_db'
}

def procesar_coches(cursor, connection, fecha, lista_coches):
    lista_coches = list(set(lista_coches))  # eliminar duplicados
    for numero_coche in lista_coches:
        if not str(numero_coche).isdigit():
            continue  # omitir valores que no sean números válidos

        # Insertar coche si no existe
        cursor.execute("SELECT id FROM coches WHERE numero_coche = %s", (numero_coche,))
        coche_row = cursor.fetchone()
        if not coche_row:
            cursor.execute(
                "INSERT INTO coches (id, numero_coche, created_at) VALUES (UUID(), %s, NOW())",
                (numero_coche,)
            )
            connection.commit()
            print(f"➕ Coche {numero_coche} agregado.")
            cursor.execute("SELECT id FROM coches WHERE numero_coche = %s", (numero_coche,))
            coche_row = cursor.fetchone()
        coche_id = coche_row[0]

        # Buscar empleado asignado
        cursor.execute("SELECT id FROM users WHERE coche_asignado = %s", (numero_coche,))
        empleado_row = cursor.fetchone()
        empleado_id = empleado_row[0] if empleado_row else None

        # Verificar si ya existe franco
        cursor.execute(
            "SELECT id FROM francos WHERE coche_id = %s AND fecha = %s",
            (coche_id, fecha)
        )
        if cursor.fetchone():
            print(f"🔄 Ya existe franco para coche {numero_coche} en {fecha}.")
        else:
            cursor.execute(
                """
                INSERT INTO francos 
                (id, coche_id, empleado_id, fecha, estado, motivo, numero_coche) 
                VALUES (UUID(), %s, %s, %s, NULL, NULL, %s)
                """,
                (coche_id, empleado_id, fecha, numero_coche)
            )
            print(f"✅ Franco agregado: Coche {numero_coche}, Fecha {fecha}")

def cargar_francos_desde_excel(excel_path):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    try:
        df = pd.read_excel(excel_path)

        # Asumiendo que las columnas se llaman exactamente 'Fecha' y 'NumeroCoche'
        for _, row in df.iterrows():
            fecha = row['Fecha']
            numero_coche = str(row['NumeroCoche']).strip()
            if not fecha or not numero_coche:
                continue
            # Convertir fecha a string 'YYYY-MM-DD' si viene en datetime
            if hasattr(fecha, 'strftime'):
                fecha_str = fecha.strftime('%Y-%m-%d')
            else:
                fecha_str = str(fecha)

            procesar_coches(cursor, connection, fecha_str, [numero_coche])

        connection.commit()
        print("\n✅ Todos los francos se cargaron correctamente desde Excel.")

    except Exception as e:
        print(f"❌ Error: {e}")

    finally:
        cursor.close()
        connection.close()

# Ruta al archivo Excel generado
excel_path = r"C:\Users\Jonathan\Desktop\abjr\francos_julio.xlsx"
cargar_francos_desde_excel(excel_path)
