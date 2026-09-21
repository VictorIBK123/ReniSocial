import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constant';
import Icon from '../components/IconResolver';
import {
  Button,
  Checkbox,
  Divider,
  Input,
  SocialButton,
  Text,
  View,
} from '../components/UI';
import { login } from '../../services/auth.service';
import { validatePassword } from '../../utils/test-password';
import { useAuth, normalizeUser } from '../../store/authStore';

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await login(email, password);
      setLoading(false);
      
      if (response.status === true && response.data) {
        const user = normalizeUser(response.data);
        setUser(user);
        router.replace('/(tabs)/dashboard');
      } else {
        setError(response.message || 'Failed to sign in');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'An error occurred during sign in');
    }
  };

  return (
    <View variant="screen" style={[styles.container, { paddingTop: Math.max(insets.top + 20, 52) }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom + 16, 24) },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Bar */}
          <View variant="row" style={styles.brandHeader}>
            <Icon name="logoDark" size={32} />
            <Text variant="heading" color="dark" style={styles.brandTitle}>
              ReniSocial
            </Text>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text variant="heading" color="dark" style={styles.heading}>
              Welcome back.
            </Text>
            <Text variant="body" color="muted" style={styles.subheading}>
              Sign in to your workspace
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="you@company.com"
              leftIcon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                if (error) setError('');
              }}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              isPassword
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                if (error) setError('');
              }}
            />

            {/* Remember Me & Forgot Password Row */}
            <View variant="row" style={styles.optionsRow}>
              <Checkbox
                checked={rememberMe}
                onChange={setRememberMe}
                label="Remember me"
              />
              <TouchableOpacity activeOpacity={0.7}>
                <Text variant="link" color="primary" style={styles.forgotText}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {error ? (
              <Text variant="caption" color="danger" style={styles.errorText}>
                {error}
              </Text>
            ) : null}

            {/* Primary Action */}
            <Button
              variant="primaryNavy"
              title="Sign In"
              loading={loading}
              onPress={handleSignIn}
              style={styles.signInButton}
            />

            {/* Divider */}
            <Divider text="OR" />

            {/* Social Authentication */}
            <SocialButton
              provider="google"
              onPress={() => router.push('/welcome-success' as any)}
            />
          </View>

          {/* Footer Link */}
          <View style={styles.footer}>
            <Text variant="caption" color="muted">
              New to Renisocial?{' '}
              <Text
                variant="link"
                color="primary"
                onPress={() => router.push('/sign-up' as any)}
                style={styles.createAccountLink}
              >
                Create account
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  brandHeader: {
    gap: 8,
    marginTop: 4,
    marginBottom: 28,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  titleSection: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
  },
  form: {
    flex: 1,
  },
  optionsRow: {
    justifyContent: 'space-between',
    marginBottom: 22,
    marginTop: 2,
  },
  forgotText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  signInButton: {
    borderRadius: 26,
    height: 52,
    marginTop: 8,
  },
  errorText: {
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 16,
  },
  createAccountLink: {
    fontWeight: '700',
  },
});
