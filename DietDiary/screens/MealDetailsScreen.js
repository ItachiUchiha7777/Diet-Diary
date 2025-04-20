import React, { useState, useEffect } from 'react';
import { 
  Appbar,
  Card,
  Title,
  Paragraph,
  Chip,
  useTheme,
  Text,
  ActivityIndicator
} from 'react-native-paper';
import { getMealDetails } from '../api';
import { Alert,View } from 'react-native';

export default function MealDetailsScreen({ route, navigation }) {
  const { mealId } = route.params;
  const { colors } = useTheme();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  const tagColors = {
    breakfast: '#FFD54F',
    lunch: '#4FC3F7',
    dinner: '#BA68C8',
    snack: '#81C784',
    cheat: '#FF8A65'
  };

  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        const data = await getMealDetails(mealId);
        setMeal(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch meal details');
      } finally {
        setLoading(false);
      }
    };

    fetchMealDetails();
  }, [mealId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Meal not found</Text>
      </View>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Meal Details" />
      </Appbar.Header>

      <Card style={{ margin: 16 }}>
        <Card.Content>
          <Title style={{ fontSize: 24, marginBottom: 8 }}>{meal.name}</Title>
          
          <Chip 
            style={{ 
              backgroundColor: tagColors[meal.tag] || '#E0E0E0',
              alignSelf: 'flex-start',
              marginBottom: 16
            }}
          >
            {meal.tag.charAt(0).toUpperCase() + meal.tag.slice(1)}
          </Chip>

          <Paragraph style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>Date: </Text>
            {new Date(meal.date).toLocaleString()}
          </Paragraph>
        </Card.Content>
      </Card>
    </>
  );
}