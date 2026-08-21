import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constant';
import Icon from './components/IconResolver';
import {
  Badge,
  Button,
  Input,
  Text,
  View,
} from './components/UI';

export default function CompleteProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [username, setUsername] = useState('johndoe');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState(email || 'anna@company.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = () => {
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
            { paddingBottom: Math.max(insets.bottom + 20, 28) },
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

          {/* Email Verified Badge */}
          <View style={styles.badgeWrapper}>
            <Badge variant="success" style={styles.verifiedBadge}>
              <View variant="row" style={styles.badgeContent}>
                <Feather name="check-circle" size={13} color={Colors.success} style={styles.badgeIcon} />
                <Text variant="caption" color="success" style={styles.badgeText}>
                  Email Verified
                </Text>
              </View>
            </Badge>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text variant="heading" color="dark" style={styles.heading}>
              Complete your profile
            </Text>
            <Text variant="body" color="muted" style={styles.subheading}>
              Fill in your registration details to finish creating your account.
            </Text>
          </View>

          {/* Form Grid */}
          <View style={styles.formGrid}>
            {/* Row 1: First Name & Last Name */}
            <View variant="row" style={styles.gridRow}>
              <Input
                label="FIRST NAME"
                placeholder="John"
                value={firstName}
                onChangeText={setFirstName}
                containerStyle={styles.gridColumn}
              />
              <Input
                label="LAST NAME"
                placeholder="Doe"
                value={lastName}
                onChangeText={setLastName}
                containerStyle={styles.gridColumn}
              />
            </View>

            {/* Row 2: Username & Phone Number */}
            <View variant="row" style={styles.gridRow}>
              <Input
                label="USERNAME"
                placeholder="johndoe"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
                containerStyle={styles.gridColumn}
              />
              <Input
                label="PHONE NUMBER"
                placeholder="000 0000 0000"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                containerStyle={styles.gridColumn}
              />
            </View>

            {/* Row 3: Gender & Email/Address */}
            <View variant="row" style={styles.gridRow}>
              <Input
                label="GENDER"
                placeholder="Male"
                value={gender}
                onChangeText={setGender}
                rightIcon="chevron-down"
                containerStyle={styles.gridColumn}
              />
              <Input
                label="EMAIL ADDRESS"
                placeholder="anna@company.com"
                value={address}
                editable={false}
                containerStyle={styles.gridColumn}
              />
            </View>

            {/* Row 4: Password & Confirm Password */}
            <View variant="row" style={styles.gridRow}>
              <Input
                label="PASSWORD"
                placeholder="••••••••"
                isPassword
                value={password}
                onChangeText={setPassword}
                containerStyle={styles.gridColumn}
              />
              <Input
                label="CONFIRM PASSWORD"
                placeholder="••••••••"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                containerStyle={styles.gridColumn}
              />
            </View>

            {/* Complete Registration Action */}
            <Button
              variant="primaryNavy"
              title="Complete Registration"
              loading={loading}
              onPress={handleComplete}
              style={styles.submitButton}
            />
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
    paddingHorizontal: 20,
  },
  brandHeader: {
    gap: 8,
    marginTop: 4,
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  badgeWrapper: {
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  verifiedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeContent: {
    alignItems: 'center',
    gap: 5,
  },
  badgeIcon: {
    marginRight: 2,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  titleSection: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  formGrid: {
    width: '100%',
  },
  gridRow: {
    gap: 12,
  },
  gridColumn: {
    flex: 1,
  },
  submitButton: {
    borderRadius: 14,
    height: 50,
    marginTop: 8,
  },
});
