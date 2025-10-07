import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { SocketProvider } from "../contexts/SocketContext";
import { MessageNotificationProvider } from "../contexts/MessageNotificationContext";
import { TranslationProvider } from "../i18n/TranslationContext";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
  title: "Creative Mark Dashboard",
  description: "Dashboard for Creative Mark system",
  icons: {
    icon: '/CreativeMarkFavicon.png',
    shortcut: '/CreativeMarkFavicon.png',
    apple: '/CreativeMarkFavicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${montserrat.variable} bg-gray-200 antialiased`}>
        <TranslationProvider>
          <AuthProvider>
            <SocketProvider>
                <MessageNotificationProvider>
                  {children}
                </MessageNotificationProvider>
            </SocketProvider>
          </AuthProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
