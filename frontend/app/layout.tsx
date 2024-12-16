import Head from "next/head";
import {Providers} from "./providers";

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/ionicons.min.css"
        />
      </Head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}