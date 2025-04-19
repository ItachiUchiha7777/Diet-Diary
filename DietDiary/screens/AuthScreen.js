import React, { useState } from 'react';
import {
  TextInput,
  Button,
  Title,
  Text,
  Card,
  useTheme,
  HelperText
} from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

export default function AuthScreen({ navigation }) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [secureText, setSecureText] = useState(true);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleAuth = () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    setEmailError('');
    navigation.navigate('Main');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Title>

          {!isLogin && (
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon name="account" />}
            />
          )}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon name="email" />}
            error={!!emailError}
          />
          <HelperText type="error" visible={!!emailError}>
            {emailError}
          </HelperText>

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry={secureText}
            left={<TextInput.Icon name="lock" />}
            right={
              <TextInput.Icon 
                name={secureText ? "eye-off" : "eye"} 
                onPress={() => setSecureText(!secureText)} 
              />
            }
          />

          <Button 
            mode="contained" 
            onPress={handleAuth}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>

          <Button 
            onPress={() => setIsLogin(!isLogin)}
            style={styles.switchButton}
            labelStyle={{ color: colors.primary }}
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    elevation: 4,
    borderRadius: 8,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
  switchButton: {
    marginTop: 16,
  },
});