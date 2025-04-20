import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  RefreshControl, 
  FlatList,
  Alert
} from 'react-native';
import { 
  Appbar,
  FAB,
  List,
  Button,
  useTheme,
  Text,
  ActivityIndicator
} from 'react-native-paper';
import { getTodayMeals, addMeal as apiAddMeal } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddMealModal from './AddMealScreen';
import { useAuth } from '../App'; // Import the useAuth hook

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { signOut } = useAuth(); // Get signOut function from AuthContext
  const [meals, setMeals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const tagColors = {
    breakfast: '#FFF9C4',
    lunch: '#B3E5FC',
    dinner: '#E1BEE7',
    snack: '#C8E6C9',
    cheat: '#FFCCBC'
  };

  const fetchMeals = async () => {
    try {
      const data = await getTodayMeals();
      setMeals(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch meals');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleLogout = async () => {
    await signOut(); // This will remove the token and update isAuthenticated
    // No need to navigate to Auth screen as AppNavigator will handle that
  };

  const handleAddMeal = async (mealData) => {
    try {
      await apiAddMeal(mealData);
      await fetchMeals(); 
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add meal');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMeals();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Appbar.Header>
        <Appbar.Content title="Today's Meals" />
        <Appbar.Action 
          icon="logout" 
          onPress={handleLogout} 
        />
      </Appbar.Header>

      {meals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No meals logged today</Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('History')}
            style={styles.historyButton}
          >
            View History
          </Button>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ flexGrow: 1 }}
          renderItem={({ item: meal }) => (
            <List.Item
              title={meal.name}
              description={meal?.tag ? meal.tag.charAt(0).toUpperCase() + meal.tag.slice(1) : ''}
              left={() => (
                <View style={[
                  styles.tagIndicator,
                  { backgroundColor: tagColors[meal.tag] || '#E0E0E0' }
                ]} />
              )}
              right={() => <List.Icon icon="chevron-right" />}
              onPress={() => navigation.navigate('MealDetails', { mealId: meal._id })}
              style={styles.listItem}
            />
          )}
          ListEmptyComponent={
            !refreshing && (
              <View style={{ padding: 20 }}>
                <Text style={{ textAlign: 'center', color: '#999' }}>No meals found.</Text>
              </View>
            )
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      />

      <AddMealModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddMeal={handleAddMeal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  listItem: {
    paddingVertical: 12,
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
    marginBottom: 20,
    color: '#666',
  },
  historyButton: {
    width: '60%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});