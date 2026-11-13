import { spawn } from 'node:child_process';
import { platform } from 'node:os';
import { join } from 'node:path';

/**
 * Detecta la ruta del binario de MySQL según el sistema operativo.
 * En Windows busca en Program Files (MySQL Server 8.0 o 8.4).
 * En Linux/Mac usa los comandos del PATH del sistema.
 */
function getMysqlBinDir(): string {
    if (platform() === 'win32') {
        return (
            process.env.MYSQL_BIN_PATH ||
            'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin'
        );
    }
    return process.env.MYSQL_BIN_PATH || '';
}

function getMysqldumpCmd(): string {
    const dir = getMysqlBinDir();
    return dir ? join(dir, 'mysqldump.exe') : 'mysqldump';
}

function getMysqlCmd(): string {
    const dir = getMysqlBinDir();
    if (!dir) return 'mysql';
    return platform() === 'win32'
        ? join(dir, 'mysql.exe')
        : join(dir, 'mysql');
}

/**
 * Genera un volcado SQL completo de la base de datos configurada en las variables de entorno.
 * Usa MYSQL_PWD para evitar que la contraseña aparezca en la lista de procesos del sistema.
 *
 * @returns Buffer con el contenido completo del archivo .sql
 * @throws Error si mysqldump no está disponible o falla
 */
export async function generateBackup(): Promise<Buffer> {
    const host     = process.env.DATABASE_HOST     || '127.0.0.1';
    const port     = process.env.DATABASE_PORT     || '3306';
    const user     = process.env.DATABASE_USERNAME || 'root';
    const password = process.env.DATABASE_PASSWORD || '';
    const database = process.env.DATABASE_NAME     || 'agrovet';

    const mysqldumpCmd = getMysqldumpCmd();

    // Los argumentos NO incluyen la contraseña; se pasa vía variable de entorno MYSQL_PWD
    const args = [
        `--host=${host}`,
        `--port=${port}`,
        `--user=${user}`,
        '--single-transaction',   // Respaldo consistente en InnoDB sin bloquear tablas
        '--routines',              // Incluir procedimientos almacenados
        '--triggers',              // Incluir disparadores
        '--hex-blob',              // Codificar BLOB en hexadecimal para portabilidad
        '--set-gtid-purged=OFF',   // Evitar error en servidores sin GTID
        '--no-tablespaces',        // Compatible con permisos de usuario estándar
        database
    ];

    // Propagar la contraseña por variable de entorno (evita exposición en ps/task manager)
    const childEnv = {
        ...process.env,
        MYSQL_PWD: password
    };

    return new Promise<Buffer>((resolve, reject) => {
        const child = spawn(mysqldumpCmd, args, {
            env: childEnv,
            windowsHide: true   // Ocultar la ventana de consola en Windows
        });

        const chunks: Buffer[] = [];

        child.stdout.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
        });

        child.stderr.on('data', (data: Buffer) => {
            const msg = data.toString();
            // Ignorar advertencias comunes de mysqldump (Using a password, etc.)
            if (
                !msg.includes('[Warning]') &&
                !msg.includes('Using a password') &&
                !msg.includes('Warning: Using a password')
            ) {
                console.warn('[AdminBackupService] mysqldump stderr:', msg.trim());
            }
        });

        child.on('error', (err) => {
            reject(new Error(
                `Error al ejecutar mysqldump: ${err.message}. ` +
                `Verifique que mysqldump esté instalado en la ruta: ${mysqldumpCmd}`
            ));
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve(Buffer.concat(chunks));
            } else {
                reject(new Error(
                    `mysqldump finalizó con código de error ${code}. ` +
                    `Verifique las credenciales de la base de datos.`
                ));
            }
        });
    });
}

/**
 * Restaura la base de datos ejecutando un archivo SQL recibido como Buffer.
 * Envía el contenido del SQL a través de stdin del cliente mysql para evitar
 * la escritura de archivos temporales en el servidor.
 *
 * @param sqlBuffer - Contenido del archivo .sql a restaurar
 * @throws Error si el cliente mysql no está disponible o falla la restauración
 */
export async function restoreBackup(sqlBuffer: Buffer): Promise<void> {
    const host     = process.env.DATABASE_HOST     || '127.0.0.1';
    const port     = process.env.DATABASE_PORT     || '3306';
    const user     = process.env.DATABASE_USERNAME || 'root';
    const password = process.env.DATABASE_PASSWORD || '';
    const database = process.env.DATABASE_NAME     || 'agrovet';

    const mysqlCmd = getMysqlCmd();

    const args = [
        `--host=${host}`,
        `--port=${port}`,
        `--user=${user}`,
        database
    ];

    const childEnv = {
        ...process.env,
        MYSQL_PWD: password
    };

    return new Promise<void>((resolve, reject) => {
        const child = spawn(mysqlCmd, args, {
            env: childEnv,
            windowsHide: true
        });

        const errorChunks: Buffer[] = [];

        child.stderr.on('data', (data: Buffer) => {
            const msg = data.toString();
            if (
                !msg.includes('[Warning]') &&
                !msg.includes('Using a password') &&
                !msg.includes('Warning: Using a password')
            ) {
                errorChunks.push(data);
            }
        });

        child.on('error', (err) => {
            reject(new Error(
                `Error al ejecutar mysql: ${err.message}. ` +
                `Verifique que el cliente mysql esté instalado en: ${mysqlCmd}`
            ));
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                const errMsg = Buffer.concat(errorChunks).toString().trim();
                reject(new Error(
                    `La restauración de la base de datos falló (código ${code}). ` +
                    (errMsg ? `Detalle: ${errMsg}` : 'Verifique que el archivo SQL sea válido.')
                ));
            }
        });

        // Enviar el buffer SQL por stdin y cerrar el stream para señalizar EOF
        child.stdin.write(sqlBuffer);
        child.stdin.end();
    });
}
