// event.js
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// Listener for 'data' event
myEmitter.on('data', () => {
  console.log('📡 Custom Event Triggered: Data received!');
});

module.exports = myEmitter;
