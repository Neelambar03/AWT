// bs-config.js
module.exports = {
  proxy: "http://localhost:3000",            // Proxy the Express server
  files: "public/**/*.{html,css,js}",        // Watch these files
  port: 3001,                                 // BrowserSync UI port
  ws: true,
  logLevel: "debug"
};
