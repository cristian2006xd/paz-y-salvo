from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# =========================
# CONEXIÓN MYSQL
# =========================
def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="paz_salvo_db",
        port=3306
    )


# =========================
# FUNCIONES INTERNAS
# =========================
def crear_areas_por_defecto(solicitud_id):
    areas = ["TICS", "FINANCIERA", "ADMINISTRATIVA", "SEGURIDAD"]

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM solicitudes_areas
        WHERE solicitud_id = %s
    """, (solicitud_id,))

    existe = cursor.fetchone()

    if existe and existe["total"] > 0:
        cursor.close()
        conn.close()
        return

    for area in areas:
        cursor.execute("""
            INSERT INTO solicitudes_areas
            (solicitud_id, area, estado, comentario)
            VALUES (%s, %s, %s, %s)
        """, (
            solicitud_id,
            area,
            "PENDIENTE",
            "Pendiente de revisión"
        ))

    conn.commit()
    cursor.close()
    conn.close()


def verificar_estado_global(solicitud_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT estado
        FROM solicitudes_areas
        WHERE solicitud_id = %s
    """, (solicitud_id,))

    areas = cursor.fetchall()

    if not areas:
        cursor.close()
        conn.close()
        return

    total = len(areas)
    completadas = len([a for a in areas if a["estado"] == "COMPLETADO"])

    if completadas == total:
        nuevo_estado = "APROBADO"
    elif completadas > 0:
        nuevo_estado = "EN_PROCESO"
    else:
        nuevo_estado = "PENDIENTE"

    cursor.execute("""
        UPDATE solicitudes
        SET estado = %s
        WHERE id = %s
    """, (nuevo_estado, solicitud_id))

    conn.commit()
    cursor.close()
    conn.close()


def registrar_auditoria(usuario, rol, modulo, accion, detalle):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO auditoria
            (usuario, rol, modulo, accion, detalle)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            usuario,
            rol,
            modulo,
            accion,
            detalle
        ))

        conn.commit()
        cursor.close()
        conn.close()

    except Exception as e:
        print("Error auditoría:", e)


# =========================
# TEST
# =========================
@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({
        "estado": "ok",
        "mensaje": "Backend Paz y Salvo funcionando"
    }), 200


# =========================
# LOGIN
# =========================
@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    usuario = data.get("usuario")
    password = data.get("password")

    if not usuario or not password:
        return jsonify({"mensaje": "Usuario y contraseña son obligatorios"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT id, nombres, apellidos, usuario, rol, area, estado
            FROM usuarios
            WHERE usuario = %s AND password = %s
        """, (usuario, password))

        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if not user:
            return jsonify({"mensaje": "Credenciales incorrectas"}), 401

        if user["estado"] != "ACTIVO":
            return jsonify({"mensaje": "Usuario inhabilitado"}), 403

        token = f"token-{user['id']}-{user['rol']}"

        registrar_auditoria(
            user["usuario"],
            user["rol"],
            "Autenticación",
            "Inicio de sesión",
            f"Usuario {user['usuario']} inició sesión correctamente"
        )

        return jsonify({
            "mensaje": "Login correcto",
            "token": token,
            "usuario": user
        }), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error en el servidor",
            "error": str(e)
        }), 500


# =========================
# USUARIOS
# =========================
@app.route("/api/usuarios", methods=["GET"])
def listar_usuarios():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT id, nombres, apellidos, usuario, rol, area, estado
            FROM usuarios
            ORDER BY id DESC
        """)

        usuarios = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(usuarios), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al listar usuarios",
            "error": str(e)
        }), 500


@app.route("/api/usuarios", methods=["POST"])
def crear_usuario():
    data = request.get_json()

    campos_obligatorios = ["nombres", "apellidos", "usuario", "password", "rol"]

    for campo in campos_obligatorios:
        if not data.get(campo):
            return jsonify({
                "mensaje": f"El campo {campo} es obligatorio"
            }), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO usuarios 
            (nombres, apellidos, usuario, password, rol, area, estado)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data.get("nombres"),
            data.get("apellidos"),
            data.get("usuario"),
            data.get("password"),
            data.get("rol"),
            data.get("area"),
            "ACTIVO"
        ))

        conn.commit()
        cursor.close()
        conn.close()

        registrar_auditoria(
            data.get("creado_por", "admin"),
            data.get("rol_creador", "admin"),
            "Usuarios",
            "Crear usuario",
            f"Se creó el usuario {data.get('usuario')} con rol {data.get('rol')}"
        )

        return jsonify({
            "mensaje": "Usuario creado correctamente"
        }), 201

    except Exception as e:
        return jsonify({
            "mensaje": "Error al crear usuario",
            "error": str(e)
        }), 500


@app.route("/api/ex-funcionarios", methods=["GET"])
def listar_ex_funcionarios():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT id, nombres, apellidos, usuario, area, estado
            FROM usuarios
            WHERE rol = 'ex_funcionario'
            AND estado = 'ACTIVO'
            ORDER BY nombres ASC
        """)

        funcionarios = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(funcionarios), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al listar ex funcionarios",
            "error": str(e)
        }), 500


# =========================
# SOLICITUDES
# =========================
@app.route("/api/solicitudes", methods=["GET"])
def listar_solicitudes():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                s.id,
                s.ex_funcionario_id,
                s.creado_por,
                s.estado,
                s.observacion,
                s.fecha_creacion,
                s.fecha_actualizacion,
                u.nombres,
                u.apellidos,
                u.usuario,
                u.area
            FROM solicitudes s
            INNER JOIN usuarios u ON s.ex_funcionario_id = u.id
            ORDER BY s.id DESC
        """)

        solicitudes = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(solicitudes), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al listar solicitudes",
            "error": str(e)
        }), 500


@app.route("/api/solicitudes", methods=["POST"])
def crear_solicitud():
    data = request.get_json()

    ex_funcionario_id = data.get("ex_funcionario_id")
    creado_por = data.get("creado_por")

    if not ex_funcionario_id or not creado_por:
        return jsonify({
            "mensaje": "Ex funcionario y usuario creador son obligatorios"
        }), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO solicitudes
            (ex_funcionario_id, creado_por, estado, observacion)
            VALUES (%s, %s, %s, %s)
        """, (
            ex_funcionario_id,
            creado_por,
            "PENDIENTE",
            ""
        ))

        conn.commit()
        solicitud_id = cursor.lastrowid

        cursor.close()
        conn.close()

        crear_areas_por_defecto(solicitud_id)

        registrar_auditoria(
            data.get("usuario", "talento_humano"),
            data.get("rol", "talento_humano"),
            "Solicitudes",
            "Crear solicitud",
            f"Se creó la solicitud #{solicitud_id}"
        )

        return jsonify({
            "mensaje": "Solicitud creada correctamente",
            "solicitud_id": solicitud_id
        }), 201

    except Exception as e:
        return jsonify({
            "mensaje": "Error al crear solicitud",
            "error": str(e)
        }), 500


@app.route("/api/solicitudes/<int:id>", methods=["GET"])
def detalle_solicitud(id):
    try:
        crear_areas_por_defecto(id)
        verificar_estado_global(id)

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                s.id,
                s.ex_funcionario_id,
                s.creado_por,
                s.estado,
                s.observacion,
                s.fecha_creacion,
                s.fecha_actualizacion,
                u.nombres,
                u.apellidos,
                u.usuario,
                u.area
            FROM solicitudes s
            INNER JOIN usuarios u ON s.ex_funcionario_id = u.id
            WHERE s.id = %s
        """, (id,))

        solicitud = cursor.fetchone()

        if not solicitud:
            cursor.close()
            conn.close()
            return jsonify({"mensaje": "Solicitud no encontrada"}), 404

        cursor.execute("""
            SELECT *
            FROM solicitudes_areas
            WHERE solicitud_id = %s
            ORDER BY id ASC
        """, (id,))

        areas = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            "solicitud": solicitud,
            "areas": areas
        }), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al obtener detalle",
            "error": str(e)
        }), 500


@app.route("/api/solicitudes/<int:id>/estado", methods=["PUT"])
def cambiar_estado_solicitud(id):
    data = request.get_json()

    estado = data.get("estado")
    observacion = data.get("observacion", "")
    usuario = data.get("usuario", "admin")
    rol = data.get("rol", "admin")

    estados_validos = ["PENDIENTE", "EN_PROCESO", "EN_REVISION", "APROBADO", "NEGADO"]

    if estado not in estados_validos:
        return jsonify({"mensaje": "Estado no válido"}), 400

    if estado == "NEGADO" and not observacion:
        return jsonify({
            "mensaje": "La observación es obligatoria al negar una solicitud"
        }), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE solicitudes
            SET estado = %s,
                observacion = %s
            WHERE id = %s
        """, (
            estado,
            observacion,
            id
        ))

        conn.commit()
        cursor.close()
        conn.close()

        registrar_auditoria(
            usuario,
            rol,
            "Solicitudes",
            f"Cambio de estado a {estado}",
            f"Solicitud #{id}. Observación: {observacion}"
        )

        return jsonify({
            "mensaje": f"Solicitud actualizada a {estado}"
        }), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al cambiar estado",
            "error": str(e)
        }), 500


@app.route("/api/ex-funcionario/<int:id>/solicitud", methods=["GET"])
def obtener_solicitud_ex_funcionario(id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                id,
                ex_funcionario_id,
                estado,
                observacion,
                fecha_creacion,
                fecha_actualizacion
            FROM solicitudes
            WHERE ex_funcionario_id = %s
            ORDER BY id DESC
            LIMIT 1
        """, (id,))

        solicitud = cursor.fetchone()

        if not solicitud:
            cursor.close()
            conn.close()
            return jsonify({
                "mensaje": "No existe solicitud registrada"
            }), 404

        solicitud_id = solicitud["id"]

        cursor.close()
        conn.close()

        crear_areas_por_defecto(solicitud_id)
        verificar_estado_global(solicitud_id)

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                id,
                ex_funcionario_id,
                estado,
                observacion,
                fecha_creacion,
                fecha_actualizacion
            FROM solicitudes
            WHERE id = %s
        """, (solicitud_id,))

        solicitud = cursor.fetchone()

        cursor.execute("""
            SELECT 
                id,
                solicitud_id,
                area,
                estado,
                comentario,
                responsable,
                detalle,
                observacion,
                fecha,
                fecha_actualizacion
            FROM solicitudes_areas
            WHERE solicitud_id = %s
            ORDER BY id ASC
        """, (solicitud_id,))

        areas = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({
            "solicitud": solicitud,
            "areas": areas
        }), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al obtener solicitud del ex funcionario",
            "error": str(e)
        }), 500


# =========================
# ÁREAS
# =========================
@app.route("/api/solicitudes/<int:id>/areas", methods=["GET"])
def obtener_areas(id):
    try:
        crear_areas_por_defecto(id)

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM solicitudes_areas
            WHERE solicitud_id = %s
            ORDER BY id ASC
        """, (id,))

        areas = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(areas), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al obtener áreas",
            "error": str(e)
        }), 500


@app.route("/api/areas/<int:id>", methods=["PUT"])
def actualizar_area(id):
    data = request.get_json()

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT solicitud_id
            FROM solicitudes_areas
            WHERE id = %s
        """, (id,))

        result = cursor.fetchone()

        if not result:
            cursor.close()
            conn.close()
            return jsonify({"mensaje": "Área no encontrada"}), 404

        solicitud_id = result[0]

        cursor.execute("""
            UPDATE solicitudes_areas
            SET estado = %s, comentario = %s
            WHERE id = %s
        """, (
            data.get("estado"),
            data.get("comentario"),
            id
        ))

        conn.commit()
        cursor.close()
        conn.close()

        verificar_estado_global(solicitud_id)

        return jsonify({"mensaje": "Área actualizada"}), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al actualizar área",
            "error": str(e)
        }), 500


@app.route("/api/areas/pendiente/<string:nombre_area>", methods=["GET"])
def obtener_pendiente_area(nombre_area):
    try:
        area_normalizada = nombre_area.upper()

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                sa.id,
                sa.solicitud_id,
                sa.area,
                sa.estado,
                sa.comentario,
                sa.responsable,
                sa.detalle,
                sa.observacion,
                sa.fecha,
                sa.fecha_actualizacion,
                s.estado AS estado_solicitud,
                u.nombres,
                u.apellidos,
                u.usuario
            FROM solicitudes_areas sa
            INNER JOIN solicitudes s ON sa.solicitud_id = s.id
            INNER JOIN usuarios u ON s.ex_funcionario_id = u.id
            WHERE UPPER(sa.area) = %s
            AND s.estado IN ('PENDIENTE', 'EN_PROCESO')
            ORDER BY sa.id ASC
            LIMIT 1
        """, (area_normalizada,))

        registro = cursor.fetchone()

        cursor.close()
        conn.close()

        if not registro:
            return jsonify({
                "mensaje": "No existen solicitudes pendientes para esta área"
            }), 404

        return jsonify(registro), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al obtener solicitud del área",
            "error": str(e)
        }), 500


@app.route("/api/areas/formulario/<int:id>", methods=["PUT"])
def guardar_formulario_area(id):
    data = request.get_json()

    responsable = data.get("responsable")
    detalle = data.get("detalle")
    observacion = data.get("observacion")

    if not responsable or not detalle:
        return jsonify({
            "mensaje": "Responsable y detalle son obligatorios"
        }), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT solicitud_id, area
            FROM solicitudes_areas
            WHERE id = %s
        """, (id,))

        result = cursor.fetchone()

        if not result:
            cursor.close()
            conn.close()
            return jsonify({"mensaje": "Registro no encontrado"}), 404

        solicitud_id = result[0]
        area = result[1]

        cursor.execute("""
            UPDATE solicitudes_areas
            SET 
                responsable = %s,
                detalle = %s,
                observacion = %s,
                comentario = %s,
                estado = 'COMPLETADO'
            WHERE id = %s
        """, (
            responsable,
            detalle,
            observacion,
            "Validación completada por el área",
            id
        ))

        conn.commit()
        cursor.close()
        conn.close()

        verificar_estado_global(solicitud_id)

        registrar_auditoria(
            data.get("usuario", "area"),
            data.get("rol", "area"),
            "Áreas",
            f"Completar área {area}",
            f"Solicitud #{solicitud_id}. Responsable: {responsable}"
        )

        return jsonify({
            "mensaje": "Área completada y estado global actualizado"
        }), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al guardar formulario del área",
            "error": str(e)
        }), 500


# =========================
# DOCUMENTOS
# =========================
@app.route("/api/documentos/subir", methods=["POST"])
def subir_documento():
    solicitud_id = request.form.get("solicitud_id")
    archivo = request.files.get("archivo")

    if not solicitud_id or not archivo:
        return jsonify({
            "mensaje": "Solicitud y archivo son obligatorios"
        }), 400

    try:
        nombre_seguro = secure_filename(archivo.filename)
        nombre_final = f"solicitud_{solicitud_id}_{nombre_seguro}"
        ruta = os.path.join(UPLOAD_FOLDER, nombre_final)

        archivo.save(ruta)

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO documentos
            (solicitud_id, nombre_archivo, ruta_archivo, estado)
            VALUES (%s, %s, %s, %s)
        """, (
            solicitud_id,
            nombre_final,
            ruta,
            "PENDIENTE"
        ))

        conn.commit()
        cursor.close()
        conn.close()

        registrar_auditoria(
            "ex_funcionario",
            "ex_funcionario",
            "Documentos",
            "Subir documento",
            f"Se subió documento firmado para solicitud #{solicitud_id}"
        )

        return jsonify({
            "mensaje": "Documento firmado subido correctamente"
        }), 201

    except Exception as e:
        return jsonify({
            "mensaje": "Error al subir documento",
            "error": str(e)
        }), 500


@app.route("/api/documentos", methods=["GET"])
def listar_documentos():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT 
                d.id,
                d.solicitud_id,
                d.nombre_archivo,
                d.ruta_archivo,
                d.estado,
                d.observacion,
                d.fecha_subida,
                d.fecha_revision,
                u.nombres,
                u.apellidos,
                u.usuario
            FROM documentos d
            INNER JOIN solicitudes s ON d.solicitud_id = s.id
            INNER JOIN usuarios u ON s.ex_funcionario_id = u.id
            ORDER BY d.id DESC
        """)

        documentos = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(documentos), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al listar documentos",
            "error": str(e)
        }), 500


@app.route("/api/documentos/<int:id>/aprobar", methods=["PUT"])
def aprobar_documento(id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE documentos
            SET estado = 'APROBADO',
                observacion = '',
                fecha_revision = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (id,))

        conn.commit()
        cursor.close()
        conn.close()

        registrar_auditoria(
            "recepcion",
            "recepcion",
            "Documentos",
            "Aprobar documento",
            f"Documento #{id} aprobado"
        )

        return jsonify({
            "mensaje": "Documento aprobado correctamente"
        }), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al aprobar documento",
            "error": str(e)
        }), 500


@app.route("/api/documentos/<int:id>/rechazar", methods=["PUT"])
def rechazar_documento(id):
    data = request.get_json()
    observacion = data.get("observacion")

    if not observacion:
        return jsonify({
            "mensaje": "La observación es obligatoria para rechazar"
        }), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE documentos
            SET estado = 'RECHAZADO',
                observacion = %s,
                fecha_revision = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (observacion, id))

        conn.commit()
        cursor.close()
        conn.close()

        registrar_auditoria(
            "recepcion",
            "recepcion",
            "Documentos",
            "Rechazar documento",
            f"Documento #{id} rechazado. Observación: {observacion}"
        )

        return jsonify({
            "mensaje": "Documento rechazado correctamente"
        }), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al rechazar documento",
            "error": str(e)
        }), 500


# =========================
# AUDITORÍA
# =========================
@app.route("/api/auditoria", methods=["GET"])
def listar_auditoria():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT id, usuario, rol, modulo, accion, detalle, fecha
            FROM auditoria
            ORDER BY id DESC
        """)

        data = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(data), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al listar auditoría",
            "error": str(e)
        }), 500
    
# =========================
# REPORTES
# =========================
@app.route("/api/reportes/resumen", methods=["GET"])
def reporte_resumen():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT COUNT(*) AS total FROM usuarios")
        total_usuarios = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM solicitudes")
        total_solicitudes = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM solicitudes WHERE estado = 'PENDIENTE'")
        pendientes = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM solicitudes WHERE estado = 'EN_PROCESO'")
        en_proceso = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM solicitudes WHERE estado = 'APROBADO'")
        aprobadas = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) AS total FROM documentos")
        total_documentos = cursor.fetchone()["total"]

        cursor.close()
        conn.close()

        return jsonify({
            "usuarios": total_usuarios,
            "solicitudes": total_solicitudes,
            "pendientes": pendientes,
            "en_proceso": en_proceso,
            "aprobadas": aprobadas,
            "documentos": total_documentos
        }), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al generar resumen",
            "error": str(e)
        }), 500

# =========================
# ACTUALIZAR USUARIO
# =========================
@app.route("/api/usuarios/<int:id>", methods=["PUT"])
def actualizar_usuario(id):
    data = request.get_json()

    try:
        conn = get_connection()
        cursor = conn.cursor()

        if data.get("password"):
            cursor.execute("""
                UPDATE usuarios
                SET nombres = %s,
                    apellidos = %s,
                    usuario = %s,
                    password = %s,
                    rol = %s,
                    area = %s,
                    estado = %s
                WHERE id = %s
            """, (
                data.get("nombres"),
                data.get("apellidos"),
                data.get("usuario"),
                data.get("password"),
                data.get("rol"),
                data.get("area"),
                data.get("estado"),
                id
            ))
        else:
            cursor.execute("""
                UPDATE usuarios
                SET nombres = %s,
                    apellidos = %s,
                    usuario = %s,
                    rol = %s,
                    area = %s,
                    estado = %s
                WHERE id = %s
            """, (
                data.get("nombres"),
                data.get("apellidos"),
                data.get("usuario"),
                data.get("rol"),
                data.get("area"),
                data.get("estado"),
                id
            ))

        conn.commit()
        cursor.close()
        conn.close()

        registrar_auditoria(
            data.get("usuario_actual", "admin"),
            data.get("rol_actual", "admin"),
            "Usuarios",
            "Actualizar usuario",
            f"Se actualizó el usuario ID {id}"
        )

        return jsonify({"mensaje": "Usuario actualizado correctamente"}), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al actualizar usuario",
            "error": str(e)
        }), 500


# =========================
# CAMBIAR ESTADO USUARIO
# =========================
@app.route("/api/usuarios/<int:id>/estado", methods=["PUT"])
def cambiar_estado_usuario(id):
    data = request.get_json()
    estado = data.get("estado")

    if estado not in ["ACTIVO", "INHABILITADO"]:
        return jsonify({"mensaje": "Estado no válido"}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE usuarios
            SET estado = %s
            WHERE id = %s
        """, (estado, id))

        conn.commit()
        cursor.close()
        conn.close()

        registrar_auditoria(
            data.get("usuario_actual", "admin"),
            data.get("rol_actual", "admin"),
            "Usuarios",
            "Cambiar estado",
            f"Usuario ID {id} cambiado a {estado}"
        )

        return jsonify({"mensaje": f"Usuario cambiado a {estado}"}), 200

    except Exception as e:
        return jsonify({
            "mensaje": "Error al cambiar estado",
            "error": str(e)
        }), 500


# =========================
# ELIMINAR USUARIO
# =========================
@app.route("/api/usuarios/<int:id>", methods=["DELETE"])
def eliminar_usuario(id):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))

        conn.commit()
        cursor.close()
        conn.close()

        registrar_auditoria(
            "admin",
            "admin",
            "Usuarios",
            "Eliminar usuario",
            f"Se eliminó el usuario ID {id}"
        )

        return jsonify({"mensaje": "Usuario eliminado correctamente"}), 200

    except Exception as e:
        return jsonify({
            "mensaje": "No se pudo eliminar. Puede estar relacionado con solicitudes.",
            "error": str(e)
        }), 500
# 🔥 SIEMPRE AL FINAL
if __name__ == "__main__":
    app.run(debug=True, port=5000)