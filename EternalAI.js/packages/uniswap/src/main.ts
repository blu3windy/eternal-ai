import * as dotenv from 'dotenv';
import {Command} from 'commander';
import {uni_swap_ai} from './index'
import * as http from "http";

dotenv.config();
const program = new Command();

const main = async () => {
    program.command('agent-infer')
        .description('Infer to agent contract')
        .option('-p, --prompt <type>', 'user prompt', '')
        .option('-k, --private_key <type>', 'private key',)
        .option('-a, --agent_address <type>', 'agent address',)
        .option('-c, --chain_id <type>', 'chain id',)
        .option('-w, --chain_id_swap <type>', 'chain id swap',)
        .action(async (options, command) => {
            // console.log(command, options);
            await uni_swap_ai(command.name(), options);
        });

    program.command('api-infer')
        .description('Infer to agent contract')
        .option('-p, --prompt <type>', 'user prompt', '')
        .option('-h, --host <type>', 'api host',)
        .option('-k, --private_key <type>', 'private key',)
        .option('-w, --chain_id_swap <type>', 'chain id swap',)
        .option('-a, --api_key <type>', 'api key',)
        .action(async (options, command) => {
            // console.log(command, options);
            await uni_swap_ai(command.name(), options);
        });

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
                                const result = await uni_swap_ai('api-infer', options);
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

