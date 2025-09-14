import Peer from 'peerjs';

class RealtimeService {
  constructor() {
    this.peer = null;
    this.connection = null;
    this.isHost = false;
    this.roomCode = '';
    this.callbacks = {
      onConnectionEstablished: null,
      onOpponentJoined: null,
      onOpponentLeft: null,
      onGameStart: null,
      onAnswerReceived: null,
      onGameStateUpdate: null,
      onError: null
    };
  }

  // Initialize peer connection
  initialize(playerId) {
    return new Promise((resolve, reject) => {
      try {
        this.peer = new Peer(playerId, {
          host: 'localhost',
          port: 9000,
          path: '/myapp',
          config: {
            'iceServers': [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' }
            ]
          }
        });

        this.peer.on('open', (id) => {
          console.log('Peer initialized with ID:', id);
          resolve(id);
        });

        this.peer.on('error', (error) => {
          console.error('Peer error:', error);
          // Fallback to PeerJS cloud server
          this.peer = new Peer(playerId);
          this.peer.on('open', (id) => {
            console.log('Peer initialized with cloud server, ID:', id);
            resolve(id);
          });
          this.peer.on('error', (cloudError) => {
            console.error('Cloud peer error:', cloudError);
            reject(cloudError);
          });
        });

        this.setupPeerListeners();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Set up peer event listeners
  setupPeerListeners() {
    this.peer.on('connection', (conn) => {
      console.log('Incoming connection from:', conn.peer);
      this.connection = conn;
      this.setupConnectionListeners(conn);
      
      if (this.callbacks.onOpponentJoined) {
        this.callbacks.onOpponentJoined(conn.peer);
      }
    });
  }

  // Set up connection event listeners
  setupConnectionListeners(conn) {
    conn.on('open', () => {
      console.log('Connection established with:', conn.peer);
      if (this.callbacks.onConnectionEstablished) {
        this.callbacks.onConnectionEstablished();
      }
    });

    conn.on('data', (data) => {
      console.log('Received data:', data);
      this.handleIncomingData(data);
    });

    conn.on('close', () => {
      console.log('Connection closed');
      if (this.callbacks.onOpponentLeft) {
        this.callbacks.onOpponentLeft();
      }
    });

    conn.on('error', (error) => {
      console.error('Connection error:', error);
      if (this.callbacks.onError) {
        this.callbacks.onError(error);
      }
    });
  }

  // Handle incoming data from peer
  handleIncomingData(data) {
    switch (data.type) {
      case 'game_start':
        if (this.callbacks.onGameStart) {
          this.callbacks.onGameStart(data.payload);
        }
        break;
      case 'answer':
        if (this.callbacks.onAnswerReceived) {
          this.callbacks.onAnswerReceived(data.payload);
        }
        break;
      case 'game_state':
        if (this.callbacks.onGameStateUpdate) {
          this.callbacks.onGameStateUpdate(data.payload);
        }
        break;
      default:
        console.log('Unknown data type:', data.type);
    }
  }

  // Create a room (host)
  createRoom(roomCode, subject) {
    this.isHost = true;
    this.roomCode = roomCode;
    this.subject = subject;
    
    // Store room info (in a real app, this would go to a server)
    localStorage.setItem('activeRoom', JSON.stringify({
      roomCode,
      hostId: this.peer.id,
      subject
    }));

    return {
      roomCode,
      hostId: this.peer.id
    };
  }

  // Join a room (guest)
  joinRoom(roomCode) {
    return new Promise((resolve, reject) => {
      this.isHost = false;
      this.roomCode = roomCode;

      // Get room info (in a real app, this would come from a server)
      const roomInfo = localStorage.getItem('activeRoom');
      if (!roomInfo) {
        reject(new Error('Room not found'));
        return;
      }

      const room = JSON.parse(roomInfo);
      if (room.roomCode !== roomCode) {
        reject(new Error('Room not found'));
        return;
      }

      // Connect to host
      this.connection = this.peer.connect(room.hostId);
      this.setupConnectionListeners(this.connection);

      this.connection.on('open', () => {
        resolve({
          roomCode,
          hostId: room.hostId,
          subject: room.subject
        });
      });
    });
  }

  // Send data to peer
  sendData(type, payload) {
    if (this.connection && this.connection.open) {
      this.connection.send({
        type,
        payload,
        timestamp: Date.now()
      });
    } else {
      console.error('No active connection to send data');
    }
  }

  // Game-specific methods
  startGame(gameData) {
    this.sendData('game_start', gameData);
  }

  sendAnswer(answerData) {
    this.sendData('answer', answerData);
  }

  updateGameState(gameState) {
    this.sendData('game_state', gameState);
  }

  // Utility methods
  isConnected() {
    return this.connection && this.connection.open;
  }

  getOpponentId() {
    return this.connection ? this.connection.peer : null;
  }

  // Set callback functions
  onConnectionEstablished(callback) {
    this.callbacks.onConnectionEstablished = callback;
  }

  onOpponentJoined(callback) {
    this.callbacks.onOpponentJoined = callback;
  }

  onOpponentLeft(callback) {
    this.callbacks.onOpponentLeft = callback;
  }

  onGameStart(callback) {
    this.callbacks.onGameStart = callback;
  }

  onAnswerReceived(callback) {
    this.callbacks.onAnswerReceived = callback;
  }

  onGameStateUpdate(callback) {
    this.callbacks.onGameStateUpdate = callback;
  }

  onError(callback) {
    this.callbacks.onError = callback;
  }

  // Cleanup
  disconnect() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    // Clean up room info if host
    if (this.isHost) {
      localStorage.removeItem('activeRoom');
    }

    this.isHost = false;
    this.roomCode = '';
  }

  // Get connection status
  getStatus() {
    return {
      isInitialized: !!this.peer,
      isConnected: this.isConnected(),
      isHost: this.isHost,
      roomCode: this.roomCode,
      peerId: this.peer ? this.peer.id : null,
      opponentId: this.getOpponentId()
    };
  }
}

// Export singleton instance
export default new RealtimeService();