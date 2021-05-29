import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Platform, StyleSheet, Text, View } from 'react-native';

import { Header } from '../components/Header';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';
import { loadPlants, PlantProps, removePlant } from '../libs/storage';
import { pt } from 'date-fns/locale';
import { formatDistance } from 'date-fns';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

import waterDrop from '../assets/waterdrop.png';

export function MyPlants() {
  const [ myPlants, setMyPlants ] = useState<PlantProps[]>([]);
  const [ loading, setLoading ] = useState(true);
  const [ nextWatered, setNextWatered ] = useState('');

  useEffect(() => {
    async function loadStorageData() {
      const plantsStoraged = await loadPlants();

      const nextTime = 
      plantsStoraged[0] ?
      formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: pt }
      )
      : ''

      setNextWatered(
        plantsStoraged[0]
        ? `Não esqueça de regar a ${plantsStoraged[0].name} em ${nextTime}`
        : ''
      );

      setMyPlants(plantsStoraged);
      setLoading(false);
    };

    loadStorageData();
  }, []);

  function handleRemovePlant(plant: PlantProps) {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      {
        text: 'Não 🙏🏽',
        style: 'cancel'
      },
      {
        text: 'Sim 😮',
        onPress: async () => {
          try {
            await removePlant(String(plant.id));

            setMyPlants(oldState => oldState.filter(item => item.id !== plant.id ));
          } catch (error) {
            Alert.alert('Não foi possível remover 😥')
          }
        }
      }
    ])
  }

  // if (loading) return <Load />

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image
          source={waterDrop}
          style={styles.spotlightImage}
        />

        <Text style={styles.spotlightText}>
          {nextWatered}
        </Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>
          Próximas regadas
        </Text>

        <FlatList
          data={myPlants}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary
              data={item}
              handleRemove={() => handleRemovePlant(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'ios' ? 50 : 0,
    backgroundColor: colors.background
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  spotlightImage: {
    width: 60,
    height: 60
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20
  },
  plants: {
    flex: 1,
    width: '100%'
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20
  },
})