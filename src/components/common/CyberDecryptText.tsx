import React, { useEffect, useState, useRef } from 'react';

interface CyberDecryptTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  triggerOnHover?: boolean;
}

const GLYPHS = '01<>[{}]_~!=+*#%$&?/^@';

export const CyberDecryptText: React.FC<CyberDecryptTextProps> = ({
  text,
  className = '',
  scrambleSpeed = 35,
  triggerOnHover = true,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const isScramblingRef = useRef(false);

  const startScramble = () => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;

    let iteration = 0;
    const maxIterations = text.length * 2.5;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 2.5) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        isScramblingRef.current = false;
      }

      iteration += 1;
    }, scrambleSpeed);
  };

  useEffect(() => {
    startScramble();
  }, [text]);

  return (
    <span
      className={`inline-block ${className}`}
      onMouseEnter={() => {
        if (triggerOnHover) startScramble();
      }}
    >
      {displayText}
    </span>
  );
};
