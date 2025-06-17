import {
 SVG_ELEMENT,
 SVG_LINK,
 SVG_TELEGRAM,
 SVG_TIKTOK,
 SVG_VK,
 SVG_YOUTUBE,
} from "assets/svg/svg";
import { Flex } from "@ui/Flex";
import { FC } from "react";

type IconProps = {
 fill: string;
 size?: number;
 opacity?: number;
};

const IconLink: Record<string, FC<IconProps>> = {
 Element: SVG_ELEMENT,
 Website: SVG_LINK,
 Aumbent: SVG_LINK,
 VK: SVG_VK,
 Telegram: SVG_TELEGRAM,
 YouTube: SVG_YOUTUBE,
 TikTok: SVG_TIKTOK,
};

const ProfileLinkFormatter = ({
 icon,
 color,
}: {
 icon: string;
 color: string;
}) => {
 const IconComponent = IconLink[icon];

 if (!IconComponent) {
  console.warn(`Icon not found for: ${icon}`);
  return null;
 }

 return <IconComponent size={14} fill={color} />;
};

export default ProfileLinkFormatter;
