import psycopg2
from psycopg2.extras import RealDictCursor
import os

def update_book_covers():
    """Actualizar los cover_url de los libros para que coincidan con las imágenes disponibles"""
    
    # Configuración de conexión
    conn_params = {
        'host': 'localhost',
        'database': 'bookrecommendations',
        'user': 'postgres',
        'password': 'espectro63',
        'port': 5432
    }
    
    # Mapeo de títulos de libros a nombres de archivo de imagen
    book_cover_mapping = {
        'Cien años de soledad': 'cien-años-soledad.jpg',
        '1984': '1984.jpg',
        'El Quijote': 'el-quijote.jpg',
        'Rayuela': 'rayuela.jpg',
        'La casa de los espíritus': 'casa-espiritus.jpg',
        'Fahrenheit 451': 'fahrenheit-1945.jpg',
        'El amor en los tiempos del cólera': 'amor-tiempos-colera.jpg',
        'Dune': 'dune.jpg',
        'El Señor de los Anillos': 'el-senor-de-los-anillos.jpg',
        'El Hobbit': 'el-hobbit.jpg',
        'It': 'it.jpg',
        'Jurassic Park': 'jurassic-park.jpg',
        'Ready Player One': 'ready-player-one.jpg',
        'El hombre en busca de sentido': 'el-hombre-en-busca-de-sentido.jpg',
        'La chica del tren': 'la-chica-del-tren.jpg',
        'El club de la pelea': 'el-club-de-la-pelea.jpg',
        'El perfume': 'el-perfume.jpg',
        'Las ventajas de ser invisible': 'las-ventajas-de-ser-invisible.jpg',
        'El principito': 'el-principito.jpg',
        'La ladrona de libros': 'la-ladrona-de-libros.jpg',
        'El guardián entre el centeno': 'el-guardian-entre-el-centeno.jpg',
        'El silencio de los corderos': 'el-silencio-de-los-corderos.jpg',
        'El psicoanalista': 'el-psicoanalista.jpg',
        'Rebelión en la granja': 'rebelion-en-la-granja.jpg',
        'El retrato de Dorian Gray': 'el-retrato-de-dorian-gray.jpg',
        'Los pilares de la tierra': 'los-pilares-de-la-tierra.jpg',
        'Drácula': 'dracula.jpg',
        'Matar a un ruiseñor': 'matar-a-un-ruisenor.jpg',
        'Moby Dick': 'moby-dick.jpg',
        'Crimen y castigo': 'crimen-y-castigo.jpg',
        'El código Da Vinci': 'el-codigo-da-vinci.jpg',
        'Orgullo y prejuicio': 'orgullo-y-prejuicio.jpg',
        'La sombra del viento': 'la-sombra-del-viento.jpg',
        'El alquimista': 'el-alquimista.jpg',
        'Los juegos del hambre': 'los-juegos-del-hambre.jpg',
        'El nombre del viento': 'el-nombre-del-viento.jpg',
        'Sapiens: De animales a dioses': 'sapiens-de-animales-a-dioses.jpg',
        'Crónica del pájaro que da cuerda al mundo': 'cronica-del-pajaro-que-da-cuerda-al-mundo.jpg'
    }
    
    try:
        # Conectar a la base de datos
        conn = psycopg2.connect(**conn_params)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        print("🔗 Conectado a PostgreSQL")
        
        # Obtener todos los libros
        cur.execute("SELECT id, title FROM books")
        books = cur.fetchall()
        
        updated_count = 0
        
        for book in books:
            title = book['title']
            book_id = book['id']
            
            # Buscar el archivo de imagen correspondiente
            cover_filename = book_cover_mapping.get(title)
            
            if cover_filename:
                # Verificar que el archivo existe
                image_path = os.path.join('images', cover_filename)
                if os.path.exists(image_path):
                    # Actualizar el cover_url en la base de datos
                    cur.execute(
                        "UPDATE books SET cover_url = %s WHERE id = %s",
                        (cover_filename, book_id)
                    )
                    updated_count += 1
                    print(f"✅ Actualizado: {title} -> {cover_filename}")
                else:
                    print(f"⚠️  Archivo no encontrado: {image_path}")
            else:
                print(f"❌ No se encontró mapeo para: {title}")
        
        conn.commit()
        print(f"\n🎉 Proceso completado. {updated_count} libros actualizados.")
        
        # Mostrar estadísticas
        cur.execute("SELECT COUNT(*) as total, COUNT(cover_url) as with_covers FROM books")
        stats = cur.fetchone()
        print(f"📊 Total de libros: {stats['total']}")
        print(f"📊 Libros con portada: {stats['with_covers']}")
        
    except psycopg2.Error as e:
        print(f"❌ Error de PostgreSQL: {e}")
    except Exception as e:
        print(f"❌ Error general: {e}")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
        print("🔌 Conexión cerrada")

if __name__ == "__main__":
    update_book_covers() 