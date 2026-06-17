import app from './app.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Echoscope service running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default server;
