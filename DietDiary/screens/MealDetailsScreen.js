import React from 'react';
import { 
  Appbar,
  Card,
  Title,
  Paragraph,
  Chip,
  useTheme,Text
} from 'react-native-paper';

export default function MealDetailsScreen({ route, navigation }) {
  const { meal } = route.params;
  const { colors } = useTheme();

  const tagColors = {
    breakfast: '#FFD54F',
    lunch: '#4FC3F7',
    dinner: '#BA68C8',
    snack: '#81C784',
    cheat: '#FF8A65'
  };

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