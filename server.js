const express = require('express');
const useragent = require('useragent');
const PDFDocument = require('pdfkit');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Función para generar contenido hexadecimal aleatorio
function generateRandomHex(length = 2000) {
    const chars = '0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < length; i++) {
        if (i > 0 && i % 32 === 0) {
            result += '\n';
        } else if (i > 0 && i % 2 === 0) {
            result += ' ';
        }
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Función para obtener información del cliente
function getClientInfo(req) {
    const agent = useragent.parse(req.headers['user-agent']);
    const ip = req.headers['x-forwarded-for'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               (req.connection.socket ? req.connection.socket.remoteAddress : null);
    
    return {
        ip: ip,
        userAgent: req.headers['user-agent'],
        browser: agent.toAgent(),
        os: agent.os.toString(),
        device: agent.device.toString(),
        language: req.headers['accept-language'],
        referer: req.headers['referer'] || 'Directo',
        timestamp: new Date().toLocaleString('es-ES'),
        headers: req.headers
    };
}

// Ruta para generar y descargar el PDF hexadecimal
app.get('/download-hex-pdf', (req, res) => {
    const clientInfo = getClientInfo(req);
    const hexContent = generateRandomHex(3000);
    
    // Crear el PDF
    const doc = new PDFDocument();
    
    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="xX_D4rK_H3x_M4tr1x_Ul7r4_S3cr3t_D0cum3nt_2024_Xx.pdf"');
    
    // Pipe del PDF a la respuesta
    doc.pipe(res);
    
    // Contenido del PDF
    doc.fontSize(10)
       .font('Courier')
       .text('=== DOCUMENTO ULTRA SECRETO ===', 50, 50)
       .text('Generado automáticamente', 50, 70)
       .text(`Timestamp: ${clientInfo.timestamp}`, 50, 90)
       .text(`IP: ${clientInfo.ip}`, 50, 110)
       .text(`User-Agent: ${clientInfo.userAgent}`, 50, 130)
       .text('\n=== CONTENIDO HEXADECIMAL MISTERIOSO ===\n', 50, 160)
       .text(hexContent, 50, 190, {
           width: 500,
           align: 'left'
       })
       .text('\n\n=== FIN DEL DOCUMENTO ===', 50, 600)
       .text('¿Puedes descifrar el mensaje oculto?', 50, 620)
       .text('Pista: No todo es lo que parece...', 50, 640);
    
    // Finalizar el PDF
    doc.end();
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API para obtener información del cliente
app.get('/api/client-info', (req, res) => {
    const clientInfo = getClientInfo(req);
    res.json(clientInfo);
});

// Ruta de login falso
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const clientInfo = getClientInfo(req);
    
    res.json({
        success: false,
        message: '¡Acceso denegado! ¿Creías que sería tan fácil?',
        attempts: Math.floor(Math.random() * 1000) + 1,
        yourInfo: clientInfo
    });
});

// Ruta "admin" falsa
app.get('/admin', (req, res) => {
    const clientInfo = getClientInfo(req);
    
    res.json({
        error: 'Acceso no autorizado',
        message: '🚨 INTENTO DE ACCESO DETECTADO 🚨',
        status: 'BLOQUEADO',
        warning: 'Este acceso ha sido registrado',
        yourInfo: clientInfo
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log('🔒 Sistema de seguridad activado');
    console.log('⚠️  Solo para pruebas éticas');
});
