import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { SocketProvider } from "../contexts/SocketContext";
import { MessageNotificationProvider } from "../contexts/MessageNotificationContext";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
  title: "Creative Mark Dashboard",
  description: "Dashboard for Creative Mark system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} bg-gray-200 antialiased`}>
        <AuthProvider>
          <SocketProvider>
              <MessageNotificationProvider>
                {children}
              </MessageNotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
