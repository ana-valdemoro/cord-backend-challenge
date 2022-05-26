import express from 'express';
import  config  from 'config';
import { logger, expressLogger, expressErrorLogger } from './logger';
import setUpApp from './middleware/express';
import setUpRoutes from './routes';

const app = express();
const { port } = config; 

app.use(expressLogger);
setUpApp(app);
setUpRoutes(app);
app.use(expressErrorLogger);

app.listen(port, () => {
  logger.info(`Express server listening on port ${port} in ${app.get('env')} mode`);
});

export default app;
