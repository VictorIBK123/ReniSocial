import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

import InstagramIcon from '../../../assets/svgs/instagram.svg';
import InstaPinkIcon from '../../../assets/svgs/insta-pink.svg';
import TwitterIcon from '../../../assets/svgs/twitter.svg';
import XBlackIcon from '../../../assets/svgs/x-black.svg';
import LogoLightIcon from '../../../assets/svgs/logo-light.svg';
import LogoDarkIcon from '../../../assets/svgs/logo-dark.svg';
import GoogleIcon from '../../../assets/svgs/google.svg';
import LinkedInIcon from '../../../assets/svgs/linkedin.svg';
import PinterestIcon from '../../../assets/svgs/pinterest.svg';
import InfoIcon from '../../../assets/svgs/info.svg';

const svgMap = {
  instagram: InstagramIcon,
  'insta-pink': InstaPinkIcon,
  twitter: TwitterIcon,
  'x-black': XBlackIcon,
  logoLight: LogoLightIcon,
  logoDark: LogoDarkIcon,
  google: GoogleIcon,
  linkedin: LinkedInIcon,
  pinterest: PinterestIcon,
  info: InfoIcon,
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
