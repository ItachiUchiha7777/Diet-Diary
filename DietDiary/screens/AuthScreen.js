import React, { useState } from 'react';
import {
  TextInput,
  Button,
  Title,
  Text,
  Card,
  useTheme,
  HelperText,
  ActivityIndicator
} from 'react-native-paper';
import { View, StyleSheet, Alert } from 'react-native';
import { register, login } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../App'; // Import the useAuth hook

export default function AuthScreen() {
  const { colors } = useTheme();
  const { signIn } = useAuth(); // Use the signIn function from context
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [secureText, setSecureText] = useState(true);
  const [errors, setErrors] = useState({
    email: '',
    general: ''
  });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', general: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!formData.password) {
      newErrors.general = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.general = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!isLogin && !formData.name.trim()) {
      newErrors.general = 'Name is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
    setErrors({ email: '', general: '' });
  
    try {
      let response;
      if (isLogin) {
        response = await login(formData.email, formData.password);
      } else {
        response = await register(formData.name, formData.email, formData.password);
      }
      
      // Ensure response contains user and token before saving
      if (response && response.token) {
        // Store user data if needed
        if (response.username) {
          await AsyncStorage.setItem('user', JSON.stringify(response.username));
        }
        
        // Use the signIn function from context - this will update the auth state
        signIn(response.token);
      } else {
        throw new Error('Authentication failed. No token returned.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors(prev => ({ ...prev, general: error.message }));
      Alert.alert(
        'Error',
        error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field] || errors.general) {
      setErrors(prev => ({ ...prev, [field]: '', general: '' }));
    }
  };

  // Rest of your component remains the same
  // ...
  
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
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon name="account" />}
              error={!!errors.general && !isLogin}
            />
          )}

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon name="email" />}
            error={!!errors.email}
          />
          <HelperText type="error" visible={!!errors.email}>
            {errors.email}
          </HelperText>

          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
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
            error={!!errors.general}
          />
          <HelperText type="error" visible={!!errors.general}>
            {errors.general}
          </HelperText>

          {loading ? (
            <ActivityIndicator animating={true} style={styles.loading} />
          ) : (
            <Button 
              mode="contained" 
              onPress={handleAuth}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              disabled={loading}
            >
              {isLogin ? 'Login' : 'Register'}
            </Button>
          )}

          <Button 
            onPress={() => {
              setIsLogin(!isLogin);
              setErrors({ email: '', general: '' });
            }}
            style={styles.switchButton}
            labelStyle={{ color: colors.primary }}
            disabled={loading}
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
  loading: {
    marginTop: 16,
  },
});