import './globals.css'; // Tailwind styles
import { Providers } from './providers'; // your Redux Providers, if you have them
import { ThemeProvider } from './theme-provider';

export const metadata = {
  title: 'My Next.js App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* No 'className' needed here, the ThemeProvider will manage the 'dark' class on <html> */}
      <body className='bg-gray-900 transition-all dark:bg-white text-black dark:text-white'>
        {/* If you also have a Redux provider, wrap them in sequence */}
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}