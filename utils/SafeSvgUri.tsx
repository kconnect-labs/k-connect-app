import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { SvgXml } from "react-native-svg";

interface SafeSvgXmlProps {
  uri: string;
  width: number;
  height: number;
}

/**
 * Проверяет SVG на неподдерживаемые теги/атрибуты
 */
const isSvgSafe = (svgText: string): boolean => {
  // Можно добавить или убрать паттерны по необходимости
  const forbidden = [
    /<style[\s\S]*?>[\s\S]*?<\/style>/i,
    /class=/i,
    /<script[\s\S]*?>[\s\S]*?<\/script>/i,
    /on\w+=/i,
    /<defs[\s\S]*?>[\s\S]*?<\/defs>/i,
  ];
  return !forbidden.some((rx) => rx.test(svgText));
};

const SafeSvgXml: React.FC<SafeSvgXmlProps> = ({ uri, width, height }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetch(uri)
      .then((res) => res.text())
      .then((text) => {
        if (!isMounted) return;
        if (isSvgSafe(text)) {
          setSvgContent(text);
        } else {
          console.warn("Unsafe SVG skipped:", uri);
        }
      })
      .catch((err) => {
        console.warn("Failed to load SVG:", uri, err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [uri]);

  if (loading) {
    return (
      <View
        style={{
          width,
          height,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (!svgContent) {
    // либо отдаём placeholder, либо null
    return null;
  }

  return <SvgXml xml={svgContent} width={width} height={height} />;
};

export default SafeSvgXml;
