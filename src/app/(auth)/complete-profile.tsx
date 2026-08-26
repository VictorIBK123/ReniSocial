import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constant';
import { completeRegistration } from '../../services/auth';
import { validatePassword } from '../../utils/test-password';
import { useAuthStore } from '../../store/authStore';
import Icon from '../components/IconResolver';
import {
  Badge,
  Button,
  Input,
  StepIndicator,
  Text,
  View,
} from '../components/UI';
export default function CompleteProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { setUser } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [address, setAddress] = useState(email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleComplete = async () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'Required';
    if (!lastName.trim()) newErrors.lastName = 'Required';
    if (!username.trim()) newErrors.username = 'Required';
    if (!phone.trim()) newErrors.phone = 'Required';
    if (!gender.trim()) newErrors.gender = 'Required';
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }
    
    if (!confirmPassword) newErrors.confirmPassword = 'Required';
    
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await completeRegistration({
        mail: address,
        fname: firstName,
        lname: lastName,
        phone: phone,
        pword: password,
        cpword: confirmPassword,
        gender: gender.toLowerCase(),
        username: username,
      });
      setLoading(false);
      
      if (response.status === true) {
        const userData = Array.isArray(response.data) ? response.data[0] : response.data;
        if (userData) {
          setUser({
            email: userData.mail,
            username: userData.username,
            token: userData.token || userData.usertoken,
            firstName: userData.fname,
            lastName: userData.lname,
            fullName: userData.fullname,
            gender: userData.gender,
            phone: userData.phone,
          });
        }
        // routing is handled automatically now
        // router.push('/welcome-success' as any);
      } else {
        setErrors({ general: response.message || 'Failed to complete registration' });
      }
    } catch (err: any) {
      setLoading(false);
      setErrors({ general: err.response?.data?.message || err.message || 'An error occurred during registration' });
    }
  };

  return (
    <View variant="screen" style={[styles.container, { paddingTop: Math.max(insets.top + 20, 52) }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? Math.max(insets.top + 20, 52) : 20}
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

          {/* Step Indicator */}
          <StepIndicator totalSteps={3} currentStep={3} />

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
                error={errors.firstName}
                onChangeText={(val) => {
                  setFirstName(val);
                  if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }));
                }}
                containerStyle={styles.gridColumn}
              />
              <Input
                label="LAST NAME"
                placeholder="Doe"
                value={lastName}
                error={errors.lastName}
                onChangeText={(val) => {
                  setLastName(val);
                  if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }));
                }}
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
                error={errors.username}
                onChangeText={(val) => {
                  setUsername(val);
                  if (errors.username) setErrors((prev) => ({ ...prev, username: '' }));
                }}
                containerStyle={styles.gridColumn}
              />
              <Input
                label="PHONE NUMBER"
                placeholder="000 0000 0000"
                keyboardType="phone-pad"
                value={phone}
                error={errors.phone}
                onChangeText={(val) => {
                  setPhone(val);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                containerStyle={styles.gridColumn}
              />
            </View>

            {/* Row 3: Gender & Email/Address */}
            <View variant="row" style={[styles.gridRow, { zIndex: 10 }]}>
              <View style={[styles.gridColumn, { zIndex: 10 }]}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.gridColumn}
                onPress={() => setShowGenderPicker(!showGenderPicker)}
              >
                <View pointerEvents="none">
                  <Input
                    label="GENDER"
                    placeholder="Select"
                    value={gender}
                    error={errors.gender}
                    onChangeText={(val) => {
                      setGender(val);
                      if (errors.gender) setErrors((prev) => ({ ...prev, gender: '' }));
                    }}
                    rightIcon="chevron-down"
                    editable={false}
                  />
                </View>
              </TouchableOpacity>
              
              {/* Inline Dropdown for Gender */}
              {showGenderPicker && (
                <View style={styles.dropdownContainer}>
                  {['Male', 'Female'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setGender(option);
                        if (errors.gender) setErrors((prev) => ({ ...prev, gender: '' }));
                        setShowGenderPicker(false);
                      }}
                    >
                      <Text variant="bodyBold" color={gender === option ? 'primary' : 'dark'}>
                        {option}
                      </Text>
                      {gender === option && (
                        <Feather name="check" size={16} color={Colors.brandPrimary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              </View>
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
                error={errors.password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                containerStyle={styles.gridColumn}
              />
              <Input
                label="CONFIRM PASSWORD"
                placeholder="••••••••"
                isPassword
                value={confirmPassword}
                error={errors.confirmPassword}
                onChangeText={(val) => {
                  setConfirmPassword(val);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                containerStyle={styles.gridColumn}
              />
            </View>

            {errors.general ? (
              <Text variant="caption" color="danger" style={styles.errorText}>
                {errors.general}
              </Text>
            ) : null}

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
    borderRadius: 26,
    height: 52,
    marginTop: 8,
  },
  errorText: {
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 20,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
});
