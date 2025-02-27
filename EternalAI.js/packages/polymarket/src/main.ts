import * as dotenv from 'dotenv';
import {Command} from 'commander';
import {polymarket_ai} from './index'
import * as http from "http";

dotenv.config();
const program = new Command();

const main = async () => {
    const PORT = 3000;
    program.command("http-server")
        .description(`Start server at http://localhost:${PORT}/`)
        .action(async (options, command) => {
            const server = http.createServer((req, res) => {
                if (req.method === 'POST') {
                    let body = '';

                    req.on('data', chunk => {
                        body += chunk.toString();
                    });

                    req.on('end', async () => {
                        try {
                            const jsonData = JSON.parse(body); // Parse JSON data
                            console.log(jsonData); // Do something with the data
                            const options = {
                                prompt: jsonData.prompt,
                                private_key: jsonData.private_key,
                            }
                            try {
                                const result = await polymarket_ai('api-infer', options);
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                res.end(JSON.stringify({
                                    error: null,
                                    data: result
                                }));
                            } catch (e: any) {
                                res.writeHead(400, {'Content-Type': 'application/json'});
                                res.end(JSON.stringify({
                                    error: e.message,
                                    data: null
                                }));
                            }

                        } catch (error) {
                            res.writeHead(400, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({error: 'Invalid JSON'}));
                        }
                    });
                } else {
                    res.writeHead(405, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Method Not Allowed'}));
                }
            });

            server.listen(PORT, () => {
                console.log(`Server running at http://localhost:${PORT}/`);
            });
        })
}

main().then(r => {
});

program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(0);
}

