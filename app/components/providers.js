'use client';

import { ThemeProvider } from "@material-tailwind/react";


export function Providers({ children }) {
  return (
    <ThemeProvider>
        {children}
    </ThemeProvider>
  );
}