import React from "react";
import { Box } from "@mui/material";

interface HighlightTextProps {
  text: string;
  highlight: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  highlight,
}) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }

  const escapedTerm = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedTerm})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <Box
            key={index}
            component="mark"
            sx={{
              backgroundColor: "rgba(255, 213, 79, 0.45)", // 柔和的亮黄背景
              fontWeight: "bold",
              borderRadius: "2px",
              padding: "0 2px",
            }}
          >
            {part}
          </Box>
        ) : (
          part
        ),
      )}
    </>
  );
};
