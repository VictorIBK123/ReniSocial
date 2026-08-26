import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Colors } from '../constant';
import OnboardingSlide1 from './components/slides/OnboardingSlide1';
import OnboardingSlide2 from './components/slides/OnboardingSlide2';
import OnboardingSlide3 from './components/slides/OnboardingSlide3';
import OnboardingSlide4 from './components/slides/OnboardingSlide4';
import OnboardingSlide5 from './components/slides/OnboardingSlide5';

export default function Index() {
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const isDarkSlide = currentPage === 0 || currentPage === 2 || currentPage === 4;

  const goToPage = (pageIndex: number) => {
    pagerRef.current?.setPage(pageIndex);
    setCurrentPage(pageIndex);
  };

  const handleNext = () => {
    if (currentPage < 4) {
      goToPage(currentPage + 1);
    }
  };

  const handleSkip = () => {
    goToPage(4);
  };

  const handleSignIn = () => {
    router.push('/(auth)/sign-in' as any);
  };

  const handleComplete = () => {
    router.push('/(auth)/sign-up' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar style={isDarkSlide ? 'light' : 'dark'} />

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        <View key="1" style={styles.slideContainer}>
          <OnboardingSlide1
            onNext={handleNext}
            onSignIn={handleSignIn}
            onDotPress={goToPage}
          />
        </View>

        <View key="2" style={styles.slideContainer}>
          <OnboardingSlide2
            onNext={handleNext}
            onSkip={handleSkip}
            onDotPress={goToPage}
          />
        </View>

        <View key="3" style={styles.slideContainer}>
          <OnboardingSlide3
            onNext={handleNext}
            onSkip={handleSkip}
            onDotPress={goToPage}
          />
        </View>

        <View key="4" style={styles.slideContainer}>
          <OnboardingSlide4
            onNext={handleNext}
            onSkip={handleSkip}
            onDotPress={goToPage}
          />
        </View>

        <View key="5" style={styles.slideContainer}>
          <OnboardingSlide5
            onComplete={handleComplete}
            onSignIn={handleSignIn}
            onDotPress={goToPage}
          />
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brandPrimary,
  },
  pagerView: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
  },
});
