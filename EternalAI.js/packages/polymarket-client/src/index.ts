import polka from "polka"
import {IncomingMessage, ServerResponse} from 'http';
import {Market} from "./market";
import YAML from 'yamljs';
import path from 'path';

const app = polka();

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');
    const responseData = {
        message: 'Hello, Polka with TypeScript!',
        status: 'success',
    };
    res.end(JSON.stringify(responseData));
});
app.get('/markets', async (req: IncomingMessage, res: ServerResponse) => {
    const market = new Market();
    const result = await market.getMarket();
    res.end(JSON.stringify({
        message: null,
        data: result,
    }));
});

app.get('/sampling_markets', async (req: IncomingMessage, res: ServerResponse) => {
    const market = new Market();
    const result = await market.getSamplingMarkets();
    res.end(JSON.stringify({
        message: null,
        data: result,
    }));
});

app.get('/simplified_markets', async (req: IncomingMessage, res: ServerResponse) => {
    const market = new Market();
    const result = await market.getSimplifiedMarkets();
    res.end(JSON.stringify({
        message: null,
        data: result,
    }));
});

app.get('/sampling_simplified_markets', async (req: IncomingMessage, res: ServerResponse) => {
    const market = new Market();
    const result = await market.getSamplingSimplifiedMarkets();
    res.end(JSON.stringify({
        message: null,
        data: result,
    }));
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
    console.log('Swagger UI available at http://localhost:3000/api-docs');
});