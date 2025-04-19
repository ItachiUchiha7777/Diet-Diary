import React, { useState } from 'react';
import {
  Appbar,
  FAB,
  List,
  useTheme,
  Portal,
  Modal,
  Button
} from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import AddMealModal from './AddMealScreen';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const [meals, setMeals] = useState([
    { id: '1', name: 'Avocado Toast', tag: 'breakfast', date: new Date().toISOString() },
    { id: '2', name: 'Chicken Salad', tag: 'lunch', date: new Date().toISOString() },
  ]);
  const [modalVisible, setModalVisible] = useState(false);

  const addMeal = (newMeal) => {
    setMeals([...meals, { 
      ...newMeal, 
      id: Date.now().toString(),
      date: new Date().toISOString()
    }]);
    setModalVisible(false);
  };

  const tagColors = {
    breakfast: '#FFD54F',
    lunch: '#4FC3F7',
    dinner: '#BA68C8',
    snack: '#81C784',
    cheat: '#FF8A65'
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Appbar.Header>
        <Appbar.Content title="Today's Meals" />
        <Appbar.Action 
          icon="history" 
          onPress={() => navigation.navigate('History')} 
        />
        <Appbar.Action 
          icon="logout" 
          onPress={() => navigation.navigate('Auth')} 
        />
      </Appbar.Header>

      <List.Section style={{ flex: 1 }}>
        {meals.map((meal) => (
          <List.Item
            key={meal.id}
            title={meal.name}
            description={`${meal.tag.charAt(0).toUpperCase() + meal.tag.slice(1)} • ${new Date(meal.date).toLocaleTimeString()}`}
            left={() => (
              <View style={[
                styles.tagIndicator,
                { backgroundColor: tagColors[meal.tag] || '#E0E0E0' }
              ]} />
            )}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => navigation.navigate('MealDetails', { meal })}
            style={styles.listItem}
          />
        ))}
      </List.Section>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      />

      <AddMealModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddMeal={addMeal}
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
});