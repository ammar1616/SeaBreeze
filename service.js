const Service = require('node-windows').Service;

const svc = new Service({
  name: 'Sea Breeze Backend',
  description: 'The Sea Breeze application server.',
  script: 'D:\\Final Projects\\SeaBreeze\\src\\app.js'
});

svc.on('install', function () {
  svc.start();
});

svc.install();