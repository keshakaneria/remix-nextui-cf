import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch
} from "remix";
import { NextUIProvider, Container, Text, css } from '@nextui-org/react'
import type { MetaFunction } from "remix";

import type { LinksFunction } from "@remix-run/node";
import styles from "../styles/global.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export const meta: MetaFunction = () => {
  return { title: "PureML" };
};
function Document({
  children,
  title = "App | PureML"
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
export default function App() {
  // throw new Error("🙀 Error");

  return (
    <Document>
      <NextUIProvider>
        <Outlet />
      </NextUIProvider>
    </Document>
  );
}

// How NextUIProvider should be used on CatchBoundary
export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <NextUIProvider>
        <Container>
          <Text h1 color="warning" css={{ textAlign: "center" }} >
            [CatchBoundary]: {caught.status} {caught.statusText}
          </Text>
        </Container>
      </NextUIProvider>
    </Document>
  );
}

// How NextUIProvider should be used on ErrorBoundary
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <NextUIProvider>
        <Container>
          <Text h1 color="error" css={{ textAlign: "center" }} >
            [ErrorBoundary]: There was an error: {error.message}
          </Text>
        </Container>
      </NextUIProvider>
    </Document>
  );
}