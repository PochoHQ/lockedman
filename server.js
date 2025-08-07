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
    console.log('📄 Descarga de PDF hex solicitada desde:', clientInfo.ip);
    
    // Crear un nuevo documento PDF
    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    
    // Configurar headers para descarga con nombre súper raro
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="xX_D4rK_H3x_M4tr1x_Ul7r4_S3cr3t_D0cum3nt_2024_Xx.pdf"');
    
    // Pipe del documento al response
    doc.pipe(res);
    
    // Título del documento
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text('🔒 DATOS HEXADECIMALES CLASIFICADOS', { align: 'center' })
       .moveDown();
    
    doc.fontSize(12)
       .font('Helvetica')
       .text('⚠️ ACCESO RESTRINGIDO - SOLO PERSONAL AUTORIZADO', { align: 'center' })
       .moveDown(2);
    
    // Generar contenido hexadecimal
    const hexContent = generateRandomHex(3000);
    
    doc.fontSize(8)
       .font('Courier')
       .text('INICIO DE TRANSMISIÓN HEXADECIMAL:', { continued: false })
       .moveDown()
       .text('═'.repeat(70))
       .moveDown()
       .text(hexContent)
       .moveDown()
       .text('═'.repeat(70))
       .moveDown()
       .text('FIN DE TRANSMISIÓN')
       .moveDown(2);
    
    // Información adicional misteriosa
    doc.fontSize(10)
       .font('Helvetica')
       .text('🕐 Timestamp de acceso: ' + new Date().toISOString())
       .text('🌐 IP de origen: ' + clientInfo.ip)
       .text('🔑 Hash de sesión: ' + Math.random().toString(36).substring(2, 15).toUpperCase())
       .text('📡 Protocolo: HEX-TRANSFER-v2.1')
       .moveDown()
       .fontSize(8)
       .text('NOTA: Este documento contiene información codificada.', { align: 'center' })
       .text('Para decodificar, utilice el algoritmo ROT13 + Base64.', { align: 'center' });
    
    // Finalizar el documento
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

// Ruta de "login" falso
app.post('/api/login', (req, res) => {
    const clientInfo = getClientInfo(req);
    console.log('Intento de login:', req.body, 'desde:', clientInfo.ip);
    
    res.json({
        success: false,
        message: '¡Acceso denegado! Pero gracias por intentarlo 😉',
        clientInfo: clientInfo
    });
});

// Ruta de "admin" falsa
app.get('/admin', (req, res) => {
    const clientInfo = getClientInfo(req);
    console.log('Acceso a /admin desde:', clientInfo.ip);
    
    res.json({
        message: '🚫 Área restringida detectada',
        warning: 'Este acceso ha sido registrado',
        yourInfo: clientInfo
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log('💡 Aplicación de testing lista para ser "hackeada"');
    console.log('📄 PDF hexadecimal disponible en /download-hex-pdf');
});