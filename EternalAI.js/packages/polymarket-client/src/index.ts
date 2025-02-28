import polka from "polka"
import {IncomingMessage, ServerResponse} from 'http';
import {Market} from "./market";

const app = polka();
const market = new Market();
app.get('/', (req: IncomingMessage, res: ServerResponse) => {
    res.end('Hello, Polka with TypeScript!');
});
app.get('/markets', async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const next_cursor = url.searchParams.get("next_cursor") || ""
    const result = await market.getMarkets(next_cursor);
    res.end(JSON.stringify({
        message: null,
        result: result,
    }));
});

app.get('/market', async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const condition_id = url.searchParams.get("condition_id") || ""
    const result = await market.getMarket(condition_id);
    res.end(JSON.stringify({
        message: null,
        result: result,
    }));
});

app.get('/sampling_markets', async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const next_cursor = url.searchParams.get("next_cursor") || ""
    const result = await market.getSamplingMarkets(next_cursor);
    res.end(JSON.stringify({
        message: null,
        result: result,
    }));
});

app.get('/simplified_markets', async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const next_cursor = url.searchParams.get("next_cursor") || ""
    const result = await market.getSimplifiedMarkets(next_cursor);
    res.end(JSON.stringify({
        message: null,
        result: result,
    }));
});

app.get('/sampling_simplified_markets', async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const next_cursor = url.searchParams.get("next_cursor") || ""
    const result = await market.getSamplingSimplifiedMarkets(next_cursor);
    res.end(JSON.stringify({
        message: null,
        result: result,
    }));
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});