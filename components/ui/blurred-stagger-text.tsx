"use client";

import { useEffect, useState } from "react";

export function BlurredStagger({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  return (
    <div className="text-muted-foreground leading-relaxed">
      {displayText}
    </div>
  );
}
