import React from "react";
import { Flex } from "@ui/Flex";
import { SVG_WIFI_STARS } from "assets/svg/svg";
import TextC from "@ui/TextC";

const Logo = () => {
 return (
  <Flex direction="column" align="center" gap={6}>
   <SVG_WIFI_STARS fill="" size={80} />
   <Flex>
    <TextC size={20} weight="bold" color="#d0bcff">
     K
    </TextC>
    <TextC size={20} weight="bold">
     -CONNECT
    </TextC>
   </Flex>
  </Flex>
 );
};

export default Logo;
