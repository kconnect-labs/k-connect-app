import { FC } from "react";
import { StyleProp, TextStyle, View } from "react-native";
type Props = {
 children: React.ReactNode;
 flex?: number;
 direction?: "row" | "column";
 gap?: number;
 justify?:
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
 align?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
 wrap?: "nowrap" | "wrap" | "wrap-reverse";
 w?: number;
 h?: number;
 className?: string;
 style?: any;
 opacity?: 100 | 50 | 25;
};
export const Flex: FC<Props> = ({
 children,
 align,
 direction,
 flex,
 gap,
 h,
 justify,
 className,
 w,
 wrap,
 style,
 opacity,
}) => {
 const JustifyFormat = {
  "flex-start": "justify-start",
  "flex-end": "justify-end",
  center: "justify-center",
  "space-between": "justify-between",
  "space-around": "justify-around",
  "space-evenly": "justify-evenly",
 }[justify ?? "flex-start"];

 const DirectionFormat = {
  row: "flex-row",
  column: "flex-col",
 }[direction ?? "row"];

 const AlignFormat = {
  "flex-start": "items-start",
  "flex-end": "items-end",
  center: "items-center",
  stretch: "items-stretch",
  baseline: "items-baseline",
 }[align ?? "flex-start"];

 return (
  <View
   style={[style, { gap: gap }]}
   className={`flex ${opacity && `opacity-${opacity}`} ${
    flex ? `flex-${flex}` : undefined
   } ${JustifyFormat} ${DirectionFormat}  ${AlignFormat} ${className}`}
  >
   {children}
  </View>
 );
};
