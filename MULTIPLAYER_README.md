# Socket.io Multiplayer Quiz Setup

## Quick Start

To test the new Socket.io multiplayer functionality:

### 1. Start the Socket.io Server
```bash
npm run server
```
This will start the server on port 3002.

### 2. Start the React Application
In a new terminal:
```bash
npm start
```
This will start the React app on port 3000.

### 3. Alternative: Run Both Together
```bash
npm run dev
```
This will start both the server and client simultaneously.

## Testing Multiplayer

1. Open the app at `http://localhost:3000`
2. Click "🚀 Quiz Battle" from the main menu
3. Enter your name and click "Create Room"
4. Share the room code with another player
5. The second player can join using the room code
6. Game starts automatically when 2 players join

## Features

### Real-time Multiplayer
- ✅ Room creation with unique codes
- ✅ Player joining and leaving
- ✅ Synchronized question delivery
- ✅ Real-time answer submission
- ✅ Speed-based scoring system
- ✅ Live results after each question
- ✅ Final game results and winner determination

### Game Mechanics
- **Questions**: 10 math and science questions per game
- **Time Limit**: 15 seconds per question
- **Scoring**: Base 100 points + time bonus (up to 50 points)
- **Auto-Start**: Game begins when 2 players join
- **Results**: Shows correct answers, explanations, and player performance

### Architecture
- **Frontend**: React with Socket.io-client
- **Backend**: Node.js with Socket.io
- **Communication**: WebSocket for real-time updates
- **Port Configuration**: Server on 3002, Client on 3000

## File Structure

```
src/components/QuizGame.js    # Main multiplayer component
server.js                    # Socket.io server
```

## Troubleshooting

### Server Issues
- If port 3002 is busy, the server will show an error
- Change the port in both `server.js` and `QuizGame.js`
- Ensure both files use the same port number

### Connection Issues
- Check that the server is running before starting the client
- Verify firewall isn't blocking connections
- For testing across devices, update the server URL in QuizGame.js

### Game State Issues
- Refresh the page to reset game state
- Server automatically cleans up rooms after 30 seconds of game completion

## Next Steps

To enhance the multiplayer system:
1. Add more question categories
2. Implement user accounts and statistics
3. Create tournament brackets
4. Add voice/text chat during games
5. Deploy server to cloud platform for remote play