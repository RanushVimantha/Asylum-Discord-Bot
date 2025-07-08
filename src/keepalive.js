import http from 'http';

export function startKeepAlive() {
  const port = process.env.PORT || 3000;
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot is alive');
  }).listen(port, () => {
    console.log(`✅ Keep-alive server running on port ${port}`);
  });
}
