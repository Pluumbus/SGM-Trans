"use client";

import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RowsPerPageProvider } from "@/tool-kit/providers/rowsPerPageProvider";
import { AnimationsProvider } from "@/tool-kit/ui/Effects";
import { useEffect } from "react";

interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const queryClient = getQueryClient();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search === "?dev") {
      const originalPush = router.push;
      router.push = async (url, as, options) => {
        let modifiedUrl = url;
        if (typeof url === "string") {
          if (url.includes("?")) {
            if (!url.includes("dev")) {
              modifiedUrl = `${url}&dev`;
            }
          } else {
            modifiedUrl = `${url}?dev`;
          }
        } else if (typeof url === "object" && url !== null) {
          url.query = url.query || {};

          if (!("dev" in url.query)) {
            url.query.dev = "";
          }
          modifiedUrl = url;
        }

        console.log("modifiedUrl: ", modifiedUrl);

        return originalPush(modifiedUrl, as, options);
      };
    }
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <RowsPerPageProvider>
        <NextUIProvider navigate={router.push} locale="ru">
          <NextThemesProvider {...themeProps} defaultTheme="light">
            <AnimationsProvider>{children}</AnimationsProvider>
          </NextThemesProvider>
        </NextUIProvider>
      </RowsPerPageProvider>
    </QueryClientProvider>
  );
}
