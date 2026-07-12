import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Raw body parser for passing binary data/POST body directly to PHP
app.use(express.raw({ type: '*/*', limit: '50mb' }));

// Middleware to run PHP files via php-cgi or php CLI
const runPhp = (req, res, next) => {
  // Extract file path from originalUrl (e.g. /api/cms.php -> api/cms.php)
  const relativePath = req.originalUrl.split('?')[0].replace(/^\//, '');
  const filePath = path.join(__dirname, relativePath);
  
  if (!fs.existsSync(filePath) || !filePath.endsWith('.php')) {
    return next();
  }

  // Determine which PHP binary to use (try php-cgi first, then php CLI)
  const phpBin = 'php-cgi';
  
  // Set up CGI environment variables
  const env = {
    ...process.env,
    GATEWAY_INTERFACE: 'CGI/1.1',
    SERVER_PROTOCOL: 'HTTP/1.1',
    REDIRECT_STATUS: 200,
    SCRIPT_FILENAME: filePath,
    SCRIPT_NAME: '/' + relativePath,
    REQUEST_METHOD: req.method,
    QUERY_STRING: req.url.includes('?') ? req.url.split('?')[1] : '',
    CONTENT_TYPE: req.headers['content-type'] || '',
    CONTENT_LENGTH: req.headers['content-length'] || '0',
    REMOTE_ADDR: req.ip || req.connection.remoteAddress || '',
  };

  // Copy HTTP headers to HTTP_* environment variables (expected by CGI)
  for (const [key, value] of Object.entries(req.headers)) {
    const envKey = 'HTTP_' + key.toUpperCase().replace(/-/g, '_');
    env[envKey] = value;
  }

  // Spawn PHP CGI process
  const php = spawn(phpBin, [], { env });

  let stdout = [];
  let stderr = [];

  if (req.body && req.body.length > 0) {
    php.stdin.write(req.body);
  }
  php.stdin.end();

  php.stdout.on('data', (data) => {
    stdout.push(data);
  });

  php.stderr.on('data', (data) => {
    stderr.push(data);
  });

  php.on('close', (code) => {
    if (code !== 0) {
      console.warn('php-cgi was not found or exited with code:', code, '. Falling back to php CLI...');
      fallbackToCli(filePath, req, res);
      return;
    }

    const output = Buffer.concat(stdout);
    parseAndSendCgiResponse(output, res);
  });
};

// Fallback to PHP CLI if php-cgi is not available
const fallbackToCli = (filePath, req, res) => {
  const env = {
    ...process.env,
    REQUEST_METHOD: req.method,
    QUERY_STRING: req.url.includes('?') ? req.url.split('?')[1] : '',
    CONTENT_TYPE: req.headers['content-type'] || '',
    CONTENT_LENGTH: req.headers['content-length'] || '0',
  };

  for (const [key, value] of Object.entries(req.headers)) {
    const envKey = 'HTTP_' + key.toUpperCase().replace(/-/g, '_');
    env[envKey] = value;
  }

  const php = spawn('php', [filePath], { env });

  let stdout = [];
  let stderr = [];

  if (req.body && req.body.length > 0) {
    php.stdin.write(req.body);
  }
  php.stdin.end();

  php.stdout.on('data', (data) => {
    stdout.push(data);
  });

  php.stderr.on('data', (data) => {
    stderr.push(data);
  });

  php.on('close', (code) => {
    if (code !== 0) {
      res.status(500).json({ error: 'PHP execution failed', details: Buffer.concat(stderr).toString() });
      return;
    }

    const output = Buffer.concat(stdout);
    parseAndSendCgiResponse(output, res);
  });
};

// Parse headers and body returned by PHP CGI/CLI
const parseAndSendCgiResponse = (output, res) => {
  const headerIndex = output.indexOf('\r\n\r\n');
  const dividerLen = 4;
  let headersPart = '';
  let bodyPart = output;

  if (headerIndex !== -1) {
    headersPart = output.toString('utf8', 0, headerIndex);
    bodyPart = output.slice(headerIndex + dividerLen);
  } else {
    const altHeaderIndex = output.indexOf('\n\n');
    if (altHeaderIndex !== -1) {
      headersPart = output.toString('utf8', 0, altHeaderIndex);
      bodyPart = output.slice(altHeaderIndex + 2);
    }
  }

  let statusCode = 200;
  if (headersPart) {
    const lines = headersPart.split(/\r?\n/);
    lines.forEach((line) => {
      const match = line.match(/^([^:]+):\s*(.*)$/);
      if (match) {
        const name = match[1].trim();
        const value = match[2].trim();
        if (name.toLowerCase() === 'status') {
          statusCode = parseInt(value.split(' ')[0]) || 200;
        } else {
          res.setHeader(name, value);
        }
      }
    });
  }

  res.status(statusCode).send(bodyPart);
};

// Route all API requests through the PHP CGI handler
app.use('/api', runPhp);

// Serve static React production files from the dist/ folder
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback for routing (like /admin, /services)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Node.js/PHP Gateway server running on port ${port}`);
});
