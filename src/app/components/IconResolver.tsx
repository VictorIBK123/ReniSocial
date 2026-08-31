import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

import InstagramIcon from '../../../assets/svgs/instagram.svg';
import TwitterIcon from '../../../assets/svgs/twitter.svg';
import LogoLightIcon from '../../../assets/svgs/logo-light.svg';
import LogoDarkIcon from '../../../assets/svgs/logo-dark.svg';
import GoogleIcon from '../../../assets/svgs/google.svg';
import LinkedInIcon from '../../../assets/svgs/linkedin.svg';
import PinterestIcon from '../../../assets/svgs/pinterest.svg';
import InfoIcon from '../../../assets/svgs/info.svg';
import CalendarDashboardIcon from '../../../assets/svgs/calendar-dashboard.svg';
import InstagramGradientIcon from '../../../assets/svgs/instagram-gradient.svg';
import XIconIcon from '../../../assets/svgs/x-icon.svg';
import FilterIcon from '../../../assets/svgs/filter.svg';
import DeleteIcon from '../../../assets/svgs/delete.svg';
import EditIcon from '../../../assets/svgs/edit.svg';
import RefreshRedIcon from '../../../assets/svgs/refresh-red.svg';
import DoneIcon from '../../../assets/svgs/done.svg';
import AnalyticsIcon from '../../../assets/svgs/icon-analytics.svg';
import LightbulbIcon from '../../../assets/svgs/icon-lightbulb.svg';
import BoardIcon from '../../../assets/svgs/board.svg';
import GridIcon from '../../../assets/svgs/grid.svg';
import TableIcon from '../../../assets/svgs/table.svg';
import WorkspaceIcon from '../../../assets/svgs/workspace.svg';
import PreferenceIcon from '../../../assets/svgs/preference.svg';
import HumanIcon from '../../../assets/svgs/human.svg';
import KeyIcon from '../../../assets/svgs/key.svg';
import LockIcon from '../../../assets/svgs/lock.svg';
import TeamFillIcon from '../../../assets/svgs/team-fill.svg';
import UploadIcon from '../../../assets/svgs/upload.svg';
import MembersIcon from '../../../assets/svgs/members.svg';
import BadgeIcon from '../../../assets/svgs/badge.svg';
import PendingIcon from '../../../assets/svgs/pending.svg';
import GalleryIcon from '../../../assets/svgs/gallery.svg';
import DraftIcon from '../../../assets/svgs/draft.svg';
import SendIcon from '../../../assets/svgs/send.svg';

const svgMap = {
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  logoLight: LogoLightIcon,
  logoDark: LogoDarkIcon,
  google: GoogleIcon,
  linkedin: LinkedInIcon,
  pinterest: PinterestIcon,
  info: InfoIcon,
  'calendar-dashboard': CalendarDashboardIcon,
  'instagram-gradient': InstagramGradientIcon,
  'x-icon': XIconIcon,
  filter: FilterIcon,
  delete: DeleteIcon,
  edit: EditIcon,
  'refresh-red': RefreshRedIcon,
  done: DoneIcon,
  'icon-analytics': AnalyticsIcon,
  'icon-lightbulb': LightbulbIcon,
  board: BoardIcon,
  grid: GridIcon,
  table: TableIcon,
  workspace: WorkspaceIcon,
  preference: PreferenceIcon,
  human: HumanIcon,
  key: KeyIcon,
  lock: LockIcon,
  'team-fill': TeamFillIcon,
  upload: UploadIcon,
  members: MembersIcon,
  badge: BadgeIcon,
  pending: PendingIcon,
  gallery: GalleryIcon,
  draft: DraftIcon,
  send: SendIcon,
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
