import React, { useState, useEffect } from 'react'
import { Share } from 'react-native'
import { HStack, useToast, VStack } from 'native-base'
import { Header } from '../components/Header'
import { api } from '../services/api';
import { useRoute } from '@react-navigation/native';
import { Loading } from '../components/Loading';
import { PoolCardPros } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';

interface RouteParams {
  id: string;
}

export function Details() {
  const [pool, setPool] = useState<PoolCardPros>({} as PoolCardPros)
  const [optionSelected, setOptionSelected] = useState<'guesses'|'ranking'>('guesses')
  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()
  const route = useRoute()
  const { id } = route.params as RouteParams

  const fetchPoolDetails = async () => {
    try {
      setIsLoading(true)

      const response = await api.get(`/pools/${id}`)

      setPool(response.data.pool)      
    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Não foi possível carregar o bolão!',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeShare = async () => {
    Share.share({
      message: pool.code
    })
  }

  useEffect(() => {
    fetchPoolDetails()
  },[id])

  return isLoading ? <Loading /> : (
    <VStack flex={1} bgColor="gray.900">
      <Header title={pool.title} onShare={handleCodeShare} />

      {
        pool._count?.participants > 0 ?
        <VStack px={5} flex={1}>
          <PoolHeader data={pool} />

          <HStack bgColor="gray.800" p={1} mb={5} rounded="sm">
            <Option
            title='Seus palpites' 
            isSelected={optionSelected === 'guesses'} 
            onPress={() => setOptionSelected('guesses')}
            />
            <Option
            title='Ranking do grupo' 
            isSelected={optionSelected === 'ranking'} 
            onPress={() => setOptionSelected('ranking')}
            />
          </HStack>

          <Guesses poolId={pool.id} code={pool.code} />
        </VStack> 
        
        : <EmptyMyPoolList code={pool.code} />
      }
      
    </VStack>
  );
}
