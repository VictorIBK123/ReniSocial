import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constant';

interface PaginationDotsProps {
  total?: number;
  activeIndex: number;
  theme?: 'light' | 'dark';
  onDotPress?: (index: number) => void;
}

export default function PaginationDots({
  total = 5,
  activeIndex,
  theme = 'light',
  onDotPress,
}: PaginationDotsProps) {
  const isDark = theme === 'dark';
  const activeColor = isDark ? Colors.white : Colors.brandPrimary;
  const inactiveColor = isDark ? Colors.glass35 : Colors.dotInactive;

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            disabled={!onDotPress}
            onPress={() => onDotPress && onDotPress(index)}
            style={[
              styles.dot,
              isActive
                ? [styles.activeDot, { backgroundColor: activeColor }]
                : [styles.inactiveDot, { backgroundColor: inactiveColor }],
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 22,
  },
  inactiveDot: {
    width: 6,
  },
});
