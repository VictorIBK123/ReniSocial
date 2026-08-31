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
  StepIndicator,
  Text,
  View,
} from '../components/UI';
import { registerEmail } from '../../services/auth';

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (val: string) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleContinue = async () => {
    if (!email) {
      setError('Please enter a valid email address');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!agreed) {
      setError('Please accept the Terms of Service & Privacy Policy');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      const response = await registerEmail(email);
      setLoading(false);
      if (response.status === true) {
        router.push({
          pathname: '/verify-otp' as any,
          params: { email },
        });
      } else {
        setError(response.message || 'Failed to register email');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'An error occurred during registration');
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

          {/* Step Indicator */}
          <StepIndicator totalSteps={3} currentStep={1} />

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text variant="heading" color="dark" style={styles.heading}>
              Create your account.
            </Text>
            <Text variant="body" color="muted" style={styles.subheading}>
              Start managing your social presence.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <Input
              label="Work Email"
              placeholder="anna@company.com"
              leftIcon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              error={error}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
            />

            <View style={styles.termsRow}>
              <Checkbox checked={agreed} onChange={setAgreed}>
                <Text variant="caption" color="muted" style={styles.termsText}>
                  I agree to the{' '}
                  <Text variant="link" color="primary" style={styles.linkText}>
                    Terms of Service
                  </Text>{' '}
                  and{' '}
                  <Text variant="link" color="primary" style={styles.linkText}>
                    Privacy Policy
                  </Text>
                </Text>
              </Checkbox>
            </View>

            {error ? (
              <Text variant="caption" color="danger" style={styles.errorText}>
                {error}
              </Text>
            ) : null}

            {/* Primary Continue Button */}
            <Button
              variant="primaryNavy"
              title="Continue"
              loading={loading}
              onPress={handleContinue}
              style={styles.continueButton}
            />

            {/* Divider */}
            <Divider text="OR" />

            {/* Side-by-side Social Auth */}
            <View variant="row" style={styles.socialRow}>
              <SocialButton
                provider="google"
                compact
                onPress={() => router.push('/welcome-success' as any)}
              />
              <SocialButton
                provider="linkedin"
                compact
                onPress={() => router.push('/welcome-success' as any)}
              />
            </View>
          </View>

          {/* Footer Link */}
          <View style={styles.footer}>
            <Text variant="caption" color="muted">
              Already have an account?{' '}
              <Text
                variant="link"
                color="primary"
                onPress={() => router.push('/sign-in' as any)}
                style={styles.signInLink}
              >
                Sign in
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
    marginBottom: 24,
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
  termsRow: {
    marginBottom: 20,
    marginTop: 2,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  continueButton: {
    borderRadius: 26,
    height: 52,
    marginTop: 8,
  },
  errorText: {
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  socialRow: {
    gap: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 16,
  },
  signInLink: {
    fontWeight: '700',
  },
});
