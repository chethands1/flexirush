"use client";

import { useState, useEffect } from "react";

// Minimal Type Definitions for Office.js
type AsyncResultStatus = "succeeded" | "failed";

interface AsyncResult<T> {
  status: AsyncResultStatus;
  value: T;
  error?: { message: string };
}

interface OfficeContext {
  document: {
    getSelectedDataAsync: (
      coercionType: string,
      callback: (result: AsyncResult<string>) => void
    ) => void;
  };
}

interface OfficeInstance {
  HostType: { PowerPoint: "PowerPoint" };
  CoercionType: { Text: string };
  AsyncResultStatus: { Succeeded: AsyncResultStatus };
  context: OfficeContext;
  onReady: (callback: (info: { host: string }) => void) => void;
}

declare global {
  interface Window {
    Office?: OfficeInstance;
  }
}

export function usePowerPoint() {
  const [isPPT, setIsPPT] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Office) {
      window.Office.onReady((info) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (info.host === (window.Office as any).HostType.PowerPoint) {
          setIsPPT(true);
          console.log("✅ FlexiRush is running inside PowerPoint!");
        }
      });
    }
  }, []);

  const getSlideContext = async (): Promise<string> => {
    if (!isPPT || !window.Office) return "";

    return new Promise((resolve) => {
      window.Office!.context.document.getSelectedDataAsync(
        window.Office!.CoercionType.Text,
        (result: AsyncResult<string>) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (result.status === (window.Office as any).AsyncResultStatus.Succeeded) {
            resolve(result.value);
          } else {
            console.warn("Could not read selection:", result.error?.message);
            resolve(""); 
          }
        }
      );
    });
  };

  return { isPPT, getSlideContext };
}