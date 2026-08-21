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
import { Colors } from '../constant';
import Icon from './components/IconResolver';
import {
  Button,
  Checkbox,
  Divider,
  Input,
  SocialButton,
  Text,
  View,
} from './components/UI';

export default function SignInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/welcome-success' as any);
    }, 600);
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
              onChangeText={setEmail}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              isPassword
              value={password}
              onChangeText={setPassword}
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
    paddingHorizontal: 24,
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
    borderRadius: 14,
    height: 50,
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
