import { FC } from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

type SVGProps = {
  fill: string;
  size?: number;
  opacity?: number;
};

export const SVG_ULTIMA: FC<SVGProps> = ({ fill, size = 22, opacity = 1 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={fill}
        fillOpacity={opacity}
        d="M12.16 3h-.32L9.21 8.25h5.58zm4.3 5.25h5.16L19 3h-5.16zm4.92 1.5h-8.63V20.1zM11.25 20.1V9.75H2.62zM7.54 8.25 10.16 3H5L2.38 8.25z"
      />
    </Svg>
  );
};
export const SVG_PROFILE: FC<SVGProps> = ({ fill, size = 22, opacity = 1 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="6" r="4" fill={fill} fillOpacity={opacity} />
      <Path
        fill={fill}
        fillOpacity={opacity}
        d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5"
      />
    </Svg>
  );
};

export const SVG_ELEMENT: FC<SVGProps> = ({ fill, size = 22, opacity = 1 }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 12.7 12.7"
      fill={fill}
      fillOpacity={opacity}
    >
      <Path d="M4.972 2.383A5.023 5.023 0 000.6 7.362a5.023 5.023 0 005.023 5.022 5.023 5.023 0 005.023-5.022 5.023 5.023 0 00-.016-.399 3.865 3.865 0 01-2.016.57 3.865 3.865 0 01-3.865-3.865 3.865 3.865 0 01.223-1.285z" />
      <Circle cx="8.614" cy="3.668" r="3.521" />
    </Svg>
  );
};

export const SVG_TELEGRAM: FC<SVGProps> = ({
  fill,
  size = 22,
  opacity = 1,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={fill}
        fillOpacity={opacity}
        d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19l-9.5 5.97-4.1-1.34c-.88-.28-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.83.42z"
      />
    </Svg>
  );
};

export const SVG_PERSON_REMOVE: FC<SVGProps> = ({
  fill,
  size = 22,
  opacity = 1,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={fill}
        fillOpacity={opacity}
        d="M14 8c0-2.21-1.79-4-4-4S6 5.79 6 8s1.79 4 4 4 4-1.79 4-4m3 2v2h6v-2zM2 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4"
      />
    </Svg>
  );
};

export const SVG_SHARE_NODES: FC<SVGProps> = ({
  fill,
  size = 22,
  opacity = 1,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={fill}
        fillOpacity={opacity}
        fillRule="evenodd"
        d="M2 6.634a4.634 4.634 0 1 1 9.268 0a4.634 4.634 0 0 1-9.268 0m10.732 10.732a4.634 4.634 0 1 1 9.268 0a4.634 4.634 0 0 1-9.268 0"
      />
      <Path
        fill={fill}
        fillOpacity={opacity}
        d="M2 17.5c0-2.121 0-3.182.659-3.841S4.379 13 6.5 13s3.182 0 3.841.659S11 15.379 11 17.5s0 3.182-.659 3.841S8.621 22 6.5 22s-3.182 0-3.841-.659S2 19.621 2 17.5m11-11c0-2.121 0-3.182.659-3.841S15.379 2 17.5 2s3.182 0 3.841.659S22 4.379 22 6.5s0 3.182-.659 3.841S19.621 11 17.5 11s-3.182 0-3.841-.659S13 8.621 13 6.5"
      />
    </Svg>
  );
};

export const SVG_CHECK_CIRCLE: FC<SVGProps> = ({
  fill,
  size = 22,
  opacity = 1,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={fill}
        fillOpacity={opacity}
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z"
      />
    </Svg>
  );
};

export const SVG_WIFI_STARS: FC<SVGProps> = ({
  fill,
  size = 22,
  opacity = 1,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 204 212">
      <Defs>
        <LinearGradient
          id="paint0_linear"
          x1="100"
          y1="49"
          x2="100"
          y2="209"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#D0BCFF" />
          <Stop offset="1" stopColor="#9365FF" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear"
          x1="171.5"
          y1="159"
          x2="171.5"
          y2="212"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#D0BCFF" />
          <Stop offset="1" stopColor="#9365FF" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear"
          x1="24.5"
          y1="0"
          x2="24.5"
          y2="49"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#D0BCFF" />
          <Stop offset="1" stopColor="#9365FF" />
        </LinearGradient>
        <LinearGradient
          id="paint3_linear"
          x1="187.5"
          y1="20"
          x2="187.5"
          y2="53"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#D0BCFF" />
          <Stop offset="1" stopColor="#9365FF" />
        </LinearGradient>
      </Defs>
      <Path
        fillRule="evenodd"
        fill="url(#paint0_linear)"
        d="M78.6142 192.304L89.3052 204.105C95.2179 210.632 104.79 210.632 110.688 204.105L121.379 192.304C109.569 179.269 90.4244 179.269 78.6142 192.304ZM35.8491 145.101L57.2316 168.703C80.8068 142.665 119.186 142.665 142.777 168.703L164.159 145.101C128.728 105.977 71.2799 105.977 35.8491 145.101ZM195.567 110.417L185.542 121.484C138.301 69.3405 61.7078 69.3405 14.4516 121.484L4.42589 110.417C-1.98582 103.34 -1.33575 91.6251 5.75646 85.366C60.7399 36.878 139.268 36.878 194.252 85.366C201.344 91.6251 201.979 103.34 195.567 110.417Z"
      />
      <Path
        fill="url(#paint1_linear)"
        d="M171.5 159L163.152 177.152L145 185.5L163.152 193.781L171.5 212L179.781 193.781L198 185.5L179.781 177.152"
      />
      <Path
        fill="url(#paint2_linear)"
        d="M24.5 0L16.8438 16.8438L0 24.5L16.8438 32.1562L24.5 49L32.1562 32.1562L49 24.5L32.1562 16.8438"
      />
      <Path
        fill="url(#paint3_linear)"
        d="M187.5 20L182.344 31.3438L171 36.5L182.344 41.6562L187.5 53L192.656 41.6562L204 36.5L192.656 31.3438"
      />
    </Svg>
  );
};

export const SVG_LINK: FC<SVGProps> = ({ fill, size = 18, opacity = 1 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={fill}
        fillOpacity={opacity}
        d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z"
      />
    </Svg>
  );
};
export const SVG_VK: FC<SVGProps> = ({ fill, size = 18, opacity = 1 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={fill}
        fillOpacity={opacity}
        d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974h-3.255c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.376 2.708z"
      />
    </Svg>
  );
};
export const SVG_YOUTUBE: FC<SVGProps> = ({ fill, size = 18, opacity = 1 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={fill}
        fillOpacity={opacity}
        d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
      />
    </Svg>
  );
};

export const SVG_TIKTOK: FC<SVGProps> = ({ fill, size = 18, opacity = 1 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={fill}
        fillOpacity={opacity}
        d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.59-1.16-2.59-2.5 0-1.4 1.16-2.5 2.59-2.5.27 0 .53.04.77.13v-3.13c-.25-.02-.5-.04-.77-.04-3.09 0-5.59 2.57-5.59 5.67 0 3.1 2.5 5.67 5.59 5.67 3.09 0 5.59-2.57 5.59-5.67V9.14c.85.63 1.91 1.05 3.09 1.05V7.15c-1.32 0-2.59-.7-3.09-1.33z"
      />
    </Svg>
  );
};

export const SVG_DOLLAR: FC<SVGProps> = ({ fill, size = 18, opacity = 1 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={fill}
        fillOpacity={opacity}
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16"
      />
    </Svg>
  );
};

export const SVG_HOME: FC<SVGProps> = ({ fill, size = 18, opacity = 1 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={fill}
        fillOpacity={opacity}
        d="M18.5 3H16a.5.5 0 0 0-.5.5v.059l3.5 2.8V3.5a.5.5 0 0 0-.5-.5"
      />
      <Path
        fill={fill}
        fillOpacity={opacity}
        d="M10.75 9.5a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0"
      />
      <Path
        fill={fill}
        fillOpacity={opacity}
        fillRule="evenodd"
        d="m20.75 10.96l.782.626a.75.75 0 0 0 .936-1.172l-8.125-6.5a3.75 3.75 0 0 0-4.686 0l-8.125 6.5a.75.75 0 0 0 .937 1.172l.781-.626v10.29H2a.75.75 0 0 0 0 1.5h20a.75.75 0 0 0 0-1.5h-1.25zM9.25 9.5a2.75 2.75 0 1 1 5.5 0a2.75 2.75 0 0 1-5.5 0m2.8 3.75c.664 0 1.237 0 1.696.062c.492.066.963.215 1.345.597s.531.853.597 1.345c.058.43.062.96.062 1.573v4.423h-1.5V17c0-.728-.002-1.2-.048-1.546c-.044-.325-.114-.427-.172-.484s-.159-.128-.484-.172c-.347-.046-.818-.048-1.546-.048s-1.2.002-1.546.048c-.325.044-.427.115-.484.172s-.128.159-.172.484c-.046.347-.048.818-.048 1.546v4.25h-1.5v-4.3c0-.664 0-1.237.062-1.696c.066-.492.215-.963.597-1.345s.854-.531 1.345-.597c.459-.062 1.032-.062 1.697-.062z"
      />
    </Svg>
  );
};

export const SVG_MESSAGE: FC<SVGProps> = ({ fill, size = 22, opacity = 1 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={fill}
        fillOpacity={opacity}
        d="M4 4h16a2 2 0 012 2v10a2 2 0 01-2 2H6l-4 4V6a2 2 0 012-2z"
      />
    </Svg>
  );
};
