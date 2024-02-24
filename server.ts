import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import next from 'next';
import type { NextApiRequest, NextApiResponse } from 'next';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req: NextApiRequest, res: NextApiResponse) => handle(req, res));
  const io = new SocketIOServer(server);

  io.on('connection', (socket) => {
    // Your Socket.IO logic here
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
