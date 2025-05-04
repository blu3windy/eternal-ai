// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RockPaperScissors {
    enum Choice { None, Rock, Paper, Scissors }
    enum Result { None, Win, Lose, Draw }

    struct Game {
        address player;
        Choice playerChoice;
        Choice computerChoice;
        Result result;
        bool isFinished;
    }

    mapping(address => Game) public games;
    mapping(address => uint256) public scores;

    event GameStarted(address indexed player);
    event GameFinished(address indexed player, Result result);

    function play(Choice _playerChoice) public {
        require(_playerChoice != Choice.None, "Invalid choice");
        require(games[msg.sender].isFinished, "Previous game not finished");

        // Generate computer choice (simplified random)
        Choice computerChoice = Choice(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 3 + 1);

        // Determine result
        Result result = determineResult(_playerChoice, computerChoice);

        // Update score
        if (result == Result.Win) {
            scores[msg.sender]++;
        }

        // Create new game
        games[msg.sender] = Game({
            player: msg.sender,
            playerChoice: _playerChoice,
            computerChoice: computerChoice,
            result: result,
            isFinished: true
        });

        emit GameFinished(msg.sender, result);
    }

    function determineResult(Choice player, Choice computer) internal pure returns (Result) {
        if (player == computer) return Result.Draw;
        
        if (
            (player == Choice.Rock && computer == Choice.Scissors) ||
            (player == Choice.Paper && computer == Choice.Rock) ||
            (player == Choice.Scissors && computer == Choice.Paper)
        ) {
            return Result.Win;
        }
        
        return Result.Lose;
    }

    function getCurrentGame(address player) public view returns (
        Choice playerChoice,
        Choice computerChoice,
        Result result,
        bool isFinished
    ) {
        Game memory game = games[player];
        return (
            game.playerChoice,
            game.computerChoice,
            game.result,
            game.isFinished
        );
    }

    function getScore(address player) public view returns (uint256) {
        return scores[player];
    }
} 