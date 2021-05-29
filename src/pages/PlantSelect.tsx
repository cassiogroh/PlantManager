import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { EnvironmentButton } from '../components/EnvironmentButton';

import { Header } from '../components/Header';
import { Load } from '../components/Load';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { PlantProps } from '../libs/storage';
import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnvironmentProps {
  key: string;
  title: string;
}

export function PlantSelect() {
  const [ environments, setEnvironments ] = useState<EnvironmentProps[]>([]);
  const [ plants, setPlants ] = useState<PlantProps[]>([]);
  const [ filteredPlants, setFilteredPlants ] = useState<PlantProps[]>([]);
  const [ environmentSelected, setEnvironmentSelected ] = useState('all');
  const [ loading, setLoading ] = useState(true);

  const [ page, setPage ] = useState(1);
  const [ loadingMore, setLoadingMore ] = useState(false);

  const navigation = useNavigation();

  async function fetchPlants() {
    const { data } = await api.get(`plants?_sort=name&order=asc&_page=${page}&_limit=8`);

    if (!data) return setLoading(true);

    if (page > 1) {
      setFilteredPlants(oldState => [...oldState, ...data])
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }

    setLoadingMore(false);
    setLoading(false);
  }

  useEffect(() => {
    async function fetchEnvironments() {
      const response = await api.get('plants_environments?_sort=title&order=asc');
      setEnvironments([
        {
          key: 'all',
          title: 'Todos'
        },
        ...response.data
      ]);
    }

    fetchEnvironments()
  }, []);

  useEffect(() => {
    fetchPlants()
  }, []);

  function handleEnvironmentSelected(environment: string) {
    setEnvironmentSelected(environment);

    if(environment === 'all')
    return setFilteredPlants(plants);

    const filtered = plants.filter(plant => plant.environments.includes(environment));

    setFilteredPlants(filtered);
  }

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate('PlantSave', { plant });
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) return;

    setLoadingMore(true);
    setPage(oldState => oldState + 1);
    fetchPlants();
  }

  // if (loading) return <Load />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />

        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
      </View>

      <View>
        <FlatList
          data={environments}
          renderItem={({ item }) => (
            <EnvironmentButton
              title={item.title}
              active={item.key === environmentSelected}
              onPress={() => handleEnvironmentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
          keyExtractor={item => String(item.key)}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          renderItem={({ item }) => (
            <PlantCardPrimary
              data={item}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          keyExtractor={item => String(item.id)}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
          ListFooterComponent={
            loadingMore
            ? <ActivityIndicator color={colors.green} />
            : <></>
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading
  },
  environmentList: {
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center'
  }
})