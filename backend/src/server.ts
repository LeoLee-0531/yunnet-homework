import app from './app';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`伺服器正在監聽 port ${PORT}`);
  console.log(`開發環境請訪問: http://localhost:${PORT}`);
});