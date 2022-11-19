import React, { useState } from 'react'
import { Heading, Text, useToast, VStack } from 'native-base'
import { Header } from '../components/Header'
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { api } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export function Find() {

  const toast = useToast()
  const { navigate } = useNavigation()

  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')


  const handleJoinPool = async () => {
    try {
      if(!code.trim()){
        return toast.show({
          title: 'Informe o código do bolão!',
          placement: 'top',
          bgColor: 'red.500'
        })
      }
      
      setIsLoading(true)

      await api.post('/pools/join', { code })

      navigate('pools')

    } catch (error) {
      setIsLoading(false)
      if(error.response?.status === 404){
        return toast.show({
          title: 'Não foi possível encontrar o bolão!',
          placement: 'top',
          bgColor: 'red.500'
        })
      }else if(error.response?.status === 403){
        return toast.show({
          title: 'Você já está nesse bolão!',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      toast.show({
        title: 'Ocorreu um erro ao tentar encontrar o bolão!',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
         <Header title='Buscar por código' showBackButton />

         <VStack mt={8} mx={5} alignItems="center">

            <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
                Encontrar um bolão através de {'\n'} um código único
            </Heading>

            <Input
            mb={2}
            placeholder="Qual o código do bolão?"
            onChangeText={setCode}
            autoCapitalize="characters"
            />

            <Button 
            title='BUSCAR BOLÃO'
            isLoading={isLoading}
            onPress={handleJoinPool}
            />
         </VStack>
    </VStack>
  )
}
