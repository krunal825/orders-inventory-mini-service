import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';
import routes from './routes/index.js';

const app = express();


app.use(express.json());
app.use(requestLogger);
// Helth Check endpoint
app.use('/health', (req, res) => res.json({ ok: true }));
app.use(routes);

app.use(errorHandler);

export default app;
