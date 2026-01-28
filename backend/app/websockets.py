from typing import List, Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Store active connections: { "session_code": [socket1, socket2] }
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_code: str):
        await websocket.accept()
        if session_code not in self.active_connections:
            self.active_connections[session_code] = []
        self.active_connections[session_code].append(websocket)

    def disconnect(self, websocket: WebSocket, session_code: str):
        if session_code in self.active_connections:
            self.active_connections[session_code].remove(websocket)
            if not self.active_connections[session_code]:
                del self.active_connections[session_code]

    async def broadcast(self, message: dict, session_code: str):
        # In a real Uber-scale app, this is where we'd use Redis Pub/Sub 
        # to broadcast to other server instances.
        if session_code in self.active_connections:
            for connection in self.active_connections[session_code]:
                await connection.send_json(message)

manager = ConnectionManager()