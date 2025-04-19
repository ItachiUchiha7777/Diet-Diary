import React, { useState } from 'react';
import {
  Modal,
  Portal,
  Text,
  Button,
  TextInput,
  HelperText,
  Menu,
  Divider,
  useTheme
} from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

export default function AddMealModal({ visible, onClose, onAddMeal }) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [tag, setTag] = useState('breakfast');
  const [menuVisible, setMenuVisible] = useState(false);

  const tags = [
    { label: 'Breakfast', value: 'breakfast', icon: 'sunny' },
    { label: 'Lunch', value: 'lunch', icon: 'silverware-fork-knife' },
    { label: 'Dinner', value: 'dinner', icon: 'moon-waning-crescent' },
    { label: 'Snack', value: 'snack', icon: 'food-apple' },
    { label: 'Cheat Meal', value: 'cheat', icon: 'alert-octagon' },
  ];

  const selectedTag = tags.find(t => t.value === tag) || tags[0];

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAddMeal({ 
      name, 
      tag,
      date: new Date().toISOString() 
    });
    setName('');
    setTag('breakfast');
    onClose();
  };

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: colors.surface,
          padding: 20,
          margin: 20,
          borderRadius: 8
        }}
      >
        <Text variant="titleLarge" style={{ marginBottom: 16 }}>
          Add New Meal
        </Text>
        
        <TextInput
          label="Meal Name"
          value={name}
          onChangeText={setName}
          style={{ marginBottom: 16 }}
          mode="outlined"
          left={<TextInput.Icon icon="food" />}
        />

        <View style={styles.menuContainer}>
          <Text variant="bodyMedium" style={styles.label}>
            Meal Type
          </Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button 
                mode="outlined" 
                onPress={() => setMenuVisible(true)}
                icon={selectedTag.icon}
                style={styles.menuButton}
                contentStyle={{ justifyContent: 'space-between' }}
              >
                {selectedTag.label}
              </Button>
            }
          >
            {tags.map((tagOption) => (
              <React.Fragment key={tagOption.value}>
                <Menu.Item
                  leadingIcon={tagOption.icon}
                  title={tagOption.label}
                  onPress={() => {
                    setTag(tagOption.value);
                    setMenuVisible(false);
                  }}
                />
                {tagOption.value !== tags[tags.length - 1].value && (
                  <Divider />
                )}
              </React.Fragment>
            ))}
          </Menu>
        </View>

        <Button 
          mode="contained" 
          onPress={handleSubmit}
          style={{ marginTop: 24 }}
          disabled={!name.trim()}
        >
          Add Meal
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  menuButton: {
    justifyContent: 'space-between',
  },
});