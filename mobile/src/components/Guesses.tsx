import React, { useState, useEffect} from 'react'
import { FlatList, useToast } from 'native-base';
import { api } from '../services/api';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {

  const [isLoading, setIsLoading] = useState(true)
  const [games, setGames] = useState<GameProps[]>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')

  const toast = useToast()

  const fetchGames = async () => {
    try {
      setIsLoading(true)

      const response = await api.get(`/pools/${poolId}/games`)

      setGames(response.data.games)
    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar os jogos nesse bolão!',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuessConfirm = async (gameId: string) => {
    try {

      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()){
        return toast.show({
          title: 'Informe o placar do palpite!',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`,{ 
        firstTeamPoints: parseInt(firstTeamPoints), 
        secondTeamPoints: parseInt(secondTeamPoints)
      })

      toast.show({
        title: 'Seu palpite foi salvo com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })
      
      fetchGames()
    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Não foi possível enviar o palpite!',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  useEffect(() => {
    fetchGames()
  },[poolId])
  

  return isLoading ? <Loading /> : (
    <FlatList
    data={games}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
    <Game 
    data={item}  
    setFirstTeamPoints={setFirstTeamPoints}
    setSecondTeamPoints={setSecondTeamPoints}
    onGuessConfirm={() => {}}
    />
    )}
    ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
