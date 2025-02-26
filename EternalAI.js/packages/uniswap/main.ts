import * as dotenv from 'dotenv';
import {Command} from 'commander';
import {uni_swap_ai} from './src/index'

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
            await uni_swap_ai(command.name(), options);
        });

    program.command('api-infer')
        .description('Infer to agent contract')
        .option('-p, --prompt <type>', 'user prompt', '')
        .option('-k, --private_key <type>', 'private key',)
        .option('-w, --chain_id_swap <type>', 'chain id swap',)
        .option('-a, --api_key <type>', 'api key',)
        .action(async (options, command) => {
            await uni_swap_ai(command.name(), options);
        });
}

main().then(r => {
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(0);
}

