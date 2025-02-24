import * as dotenv from 'dotenv';
import {Command} from 'commander';
import {uni_swap_ai} from "./src";

dotenv.config();

const main = async () => {
    const program = new Command('agent-infer');
    program
        .description('Infer to agent contract')
        .option('-p, --prompt <type>', 'user prompt', '')
        .option('-k, --private_key <type>', 'private key',)
        .option('-a, --agent_address <type>', 'agent address',)
        .option('-c, --chain_id <type>', 'chain id',)
        .action(async () => {
            const options = program.opts();
            await uni_swap_ai(options);
        });

    if (!process.argv.slice(2).length) {
        program.outputHelp();
        process.exit(0);
    }

    program.parse(process.argv);
}

main().then(r => {
});

