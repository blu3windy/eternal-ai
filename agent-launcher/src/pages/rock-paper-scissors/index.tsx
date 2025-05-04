import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import styles from './styles.module.scss';
import { playGame, getCurrentGame, getScore } from '../../services/contract';

type Choice = 'rock' | 'paper' | 'scissors';

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string>('');
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  const getChoiceNumber = (choice: Choice): number => {
    switch (choice) {
      case 'rock': return 1;
      case 'paper': return 2;
      case 'scissors': return 3;
      default: return 0;
    }
  };

  const getChoiceFromNumber = (number: number): Choice => {
    switch (number) {
      case 1: return 'rock';
      case 2: return 'paper';
      case 3: return 'scissors';
      default: return 'rock';
    }
  };

  const getResultText = (result: number): string => {
    switch (result) {
      case 1: return 'Bạn thắng!';
      case 2: return 'Máy thắng!';
      case 3: return 'Hòa!';
      default: return '';
    }
  };

  const handlePlayerChoice = async (choice: Choice) => {
    try {
      setLoading(true);
      setError(null);
      
      const choiceNumber = getChoiceNumber(choice);
      await playGame(choiceNumber);
      
      // Lấy kết quả từ contract
      const [playerChoiceNum, computerChoiceNum, resultNum] = await getCurrentGame(window.ethereum.selectedAddress);
      
      setPlayerChoice(choice);
      setComputerChoice(getChoiceFromNumber(computerChoiceNum));
      setResult(getResultText(resultNum));
      
      // Cập nhật điểm số
      const playerScore = await getScore(window.ethereum.selectedAddress);
      setScore(prev => ({ ...prev, player: playerScore.toNumber() }));
    } catch (err) {
      setError('Có lỗi xảy ra khi chơi game. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEmoji = (choice: Choice | null): string => {
    switch (choice) {
      case 'rock': return '✊';
      case 'paper': return '✋';
      case 'scissors': return '✌️';
      default: return '';
    }
  };

  return (
    <VStack spacing={8} p={8}>
      <Text fontSize="2xl" fontWeight="bold">Oẳn Tù Tì Blockchain</Text>
      
      {error && (
        <Text color="red.500">{error}</Text>
      )}
      
      <Flex gap={4}>
        <Text>Điểm của bạn: {score.player}</Text>
        <Text>Điểm của máy: {score.computer}</Text>
      </Flex>

      <Flex gap={4}>
        {choices.map((choice) => (
          <Button
            key={choice}
            onClick={() => handlePlayerChoice(choice)}
            size="lg"
            fontSize="2xl"
            p={4}
            isLoading={loading}
            disabled={loading}
          >
            {getEmoji(choice)}
          </Button>
        ))}
      </Flex>

      {playerChoice && computerChoice && (
        <VStack spacing={4}>
          <Flex gap={8}>
            <Box>
              <Text>Bạn chọn:</Text>
              <Text fontSize="4xl">{getEmoji(playerChoice)}</Text>
            </Box>
            <Box>
              <Text>Máy chọn:</Text>
              <Text fontSize="4xl">{getEmoji(computerChoice)}</Text>
            </Box>
          </Flex>
          <Text fontSize="xl" fontWeight="bold" color={result.includes('thắng') ? 'green.500' : result.includes('thua') ? 'red.500' : 'gray.500'}>
            {result}
          </Text>
        </VStack>
      )}
    </VStack>
  );
};

export default RockPaperScissors; 