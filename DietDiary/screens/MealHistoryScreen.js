import React, { useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  RefreshControl,
  Alert,
  FlatList
} from 'react-native';
import { 
  Appbar,
  List,
  Text,
  useTheme,
  ActivityIndicator
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getMealHistory } from '../api';

export default function MealHistoryScreen({ navigation }) {
  const { colors } = useTheme();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const tagColors = {
    breakfast: '#FFF9C4',
    lunch: '#B3E5FC',
    dinner: '#E1BEE7',
    snack: '#C8E6C9',
    cheat: '#FFCCBC'
  };

  const fetchMealHistory = useCallback(async () => {
    try {
      const data = await getMealHistory();
      setMeals(data);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to fetch meal history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchMealHistory();
      
      // Add cleanup function
      return () => {
        // Cancel any pending operations if needed
      };
    }, [fetchMealHistory])
  );
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMealHistory();
  }, [fetchMealHistory]);
  
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleString();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Meal History" />
      </Appbar.Header>

      <FlatList
        data={meals}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#6200ee']} 
          />
        }
        contentContainerStyle={
          meals.length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        renderItem={({ item: meal }) => (
          <List.Item
            title={meal.name}
            description={`${meal?.tag ? meal.tag.charAt(0).toUpperCase() + meal.tag.slice(1) : ''} • ${formatDate(meal.date)}`}
            left={() => (
              <View
                style={[
                  styles.tagIndicator,
                  { backgroundColor: tagColors[meal.tag] || '#E0E0E0' }
                ]}
              />
            )}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => navigation.navigate('MealDetails', { mealId: meal._id })}
            style={styles.listItem}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No meal history available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  tagIndicator: {
    width: 8,
    height: 40,
    borderRadius: 4,
    marginRight: 16,
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});