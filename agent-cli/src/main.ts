import { Command } from 'commander';
import { Framework, Model, Network } from './const';
import { createAgent, listAgents } from './handler';

// Initialize the commander object
const program = new Command();

// Define the CLI command and its options
program
    .name('eai')
    .description('You can deploy and manage your decentralized agents flexibly and simply - on any chain, any framework.')
    .version('1.0.0');


// Define a command with parameters
const agentCmd = program
    .command('agent')
    .description('Deploy and manage agents');


// Define a command with parameters
agentCmd
    .command('create')
    .description('Create a new agent')
    .option('-c, --chain <chain>', 'The blockchain which the new agent will be deployed on.', Network.Base)
    .option('-f, --framework <framework>', 'The framework is used for new agent.', Framework.Eliza)
    .option('-m, --model <model>', 'The agent\'s model.')
    .requiredOption('-p, --path <path>', 'The path of the agent\'s character file.')
    .option('-n, --name <name>', 'The agent\'s name.')
    .action((options) => {
        createAgent(options);
    })

agentCmd
    .command('ls')
    .description('See list of agents')
    .action(() => {
        listAgents();
    });



// Parse the command-line arguments
program.parse(process.argv);
