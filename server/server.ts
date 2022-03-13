import app from './app';

// set port, listen for requests
const PORT = process.env.SERVER_PORT || 8084;
app.listen(PORT, () => {
	console.info(`😈 Server is running on port http://127.0.0.1:${PORT} 📡`);
});
