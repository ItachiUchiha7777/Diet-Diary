import React from 'react';
import { FlatList } from 'react-native';
import { 
  Appbar,
  Card,
  Title,
  Paragraph,
  Button,
  useTheme
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function MealHistoryScreen({ navigation }) {
  const { colors } = useTheme();
  const [meals] = React.useState([
    { id: '1', name: 'Oatmeal', tag: 'breakfast', date: '2024-05-21T08:00:00' },
    { id: '2', name: 'Salad', tag: 'lunch', date: '2024-05-21T12:30:00' },
    { id: '3', name: 'Grilled Chicken', tag: 'dinner', date: '2024-05-21T19:15:00' },
  ]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Meal History" />
      </Appbar.Header>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Card 
            style={{ marginBottom: 16 }}
            onPress={() => navigation.navigate('MealDetails', { meal: item })}
          >
            <Card.Content>
              <Title>{item.name}</Title>
              <Paragraph>
                {item.tag.charAt(0).toUpperCase() + item.tag.slice(1)} • {formatDate(item.date)}
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button 
                onPress={() => navigation.navigate('MealDetails', { meal: item })}
                icon="arrow-right"
              >
                Details
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </>
  );
}