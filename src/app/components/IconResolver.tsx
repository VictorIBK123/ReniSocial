import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

import InstagramIcon from '../../../assets/svgs/instagram.svg';
import TwitterIcon from '../../../assets/svgs/twitter.svg';
import LogoLightIcon from '../../../assets/svgs/logo-light.svg';
import LogoDarkIcon from '../../../assets/svgs/logo-dark.svg';

const svgMap = {
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  logoLight: LogoLightIcon,
  logoDark: LogoDarkIcon,
};

export type IconName = keyof typeof svgMap;

export interface IconProps extends SvgProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const Icon = ({
  name,
  size = 24,
  width,
  height,
  color,
  ...props
}: IconProps) => {
  const SvgComponent = svgMap[name];
  if (!SvgComponent) {
    return null;
  }

  const iconWidth = width ?? size;
  const iconHeight = height ?? size;

  return (
    <SvgComponent
      width={iconWidth}
      height={iconHeight}
      color={color}
      {...props}
    />
  );
};

export default Icon;
