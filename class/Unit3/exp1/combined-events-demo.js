const http = require('http');
const EventEmitter = require('events');

// 1. Simple Event Flow
const emitter = new EventEmitter();
emitter.on('greet', () => {
  console.log('Hello from Node event-driven framework!');
});
emitter.emit('greet');

// 2. Passing Arguments
emitter.on('order', (item, qty) => {
  console.log(`Order received: ${qty} x ${item}`);
});
emitter.emit('order', 'Coffee', 2);

// 3. Logging Events in Web Server
const logger = new EventEmitter();
logger.on('log', (message) => {
  console.log('LOG:', message);
});

const server = http.createServer((req, res) => {
  logger.emit('log', `${req.method} ${req.url}`);
  res.end('Request logged!');
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));

// 4. Event Loop Example
setTimeout(() => console.log('Timeout callback'), 0);
setImmediate(() => console.log('Immediate callback'));
console.log('Synchronous log');

// 5. Custom Class with EventEmitter
class OrderService extends EventEmitter {
  placeOrder(item) {
    console.log(`Placing order for ${item}`);
    this.emit('orderPlaced', item);
  }
}

const service = new OrderService();
service.on('orderPlaced', (item) => {
  console.log(`Order confirmed for: ${item}`);
});
service.placeOrder('Pizza');
