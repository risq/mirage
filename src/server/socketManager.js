'use strict';
const socketio = require('socket.io');

const clientManager = require('./clientManager');
const stateManager = require('./stateManager');

module.exports = new class SocketManager {
  constructor(server) {
    clientManager.events.on('state:change', this.emitState.bind(this));
  }

  init(server) {
    console.log('Initialize SocketManager');
    this.io = socketio(server);
    this.io.on('connection', this.onConnection.bind(this));
  }

  onConnection(socket) {
    this.emitState(socket);
    socket.on('client:register', data => clientManager.registerClient(data.id, socket));
    socket.on('remote:register', data => clientManager.registerRemote(data.syncId, socket));
  }

  emitState(socket) {
    socket = socket || this.io.sockets;
    socket.emit('state', stateManager.getState());
  }
};
