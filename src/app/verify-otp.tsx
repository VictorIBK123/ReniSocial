import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constant';
import Icon from './components/IconResolver';
import {
  Button,
  OtpInput,
  StepIndicator,
  Text,
  View,
} from './components/UI';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const displayEmail = email || 'anna@company.com';
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(42);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/complete-profile' as any,
        params: { email: displayEmail },
      });
    }, 500);
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(60);
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
          <StepIndicator totalSteps={2} currentStep={2} />

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text variant="heading" color="dark" style={styles.heading}>
              Check your inbox.
            </Text>
            <Text variant="body" color="muted" style={styles.subheading}>
              Enter the 5-digit code sent to{' '}
              <Text variant="bodyBold" color="dark">
                {displayEmail}
              </Text>
            </Text>
          </View>

          {/* OTP Input Fields */}
          <View style={styles.otpSection}>
            <OtpInput length={5} value={otp} onChange={setOtp} />

            {/* Countdown / Resend Action */}
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={timer > 0}
              onPress={handleResend}
              style={styles.resendContainer}
            >
              <Text variant="caption" color="muted" style={styles.resendText}>
                {timer > 0
                  ? `Resend code in 00:${timer < 10 ? `0${timer}` : timer}`
                  : 'Resend code now'}
              </Text>
            </TouchableOpacity>

            {/* Verify Button */}
            <Button
              variant="primaryNavy"
              title="Verify"
              loading={loading}
              disabled={otp.length < 5 && otp.length !== 0}
              onPress={handleVerify}
              style={styles.verifyButton}
            />
          </View>

          {/* Footer Link */}
          <View style={styles.footer}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
              <Text variant="caption" color="primary" style={styles.differentEmailLink}>
                Use a different email
              </Text>
            </TouchableOpacity>
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
    lineHeight: 20,
  },
  otpSection: {
    flex: 1,
    alignItems: 'center',
  },
  resendContainer: {
    marginVertical: 12,
    paddingVertical: 4,
  },
  resendText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  verifyButton: {
    width: '100%',
    borderRadius: 14,
    height: 50,
    marginTop: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 16,
  },
  differentEmailLink: {
    fontSize: 13,
    fontWeight: '700',
  },
});
