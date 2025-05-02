import {
  EudoxusBold,
  EudoxusExtraBold,
  EudoxusLight,
  EudoxusRegular,
  EudoxusMedium,
} from "@/utils/helpers/font";

import AnimationProvider from "@/components/Contexts/AnimationProvider";
import "@/styles/globals.css";
import { cn } from "@/utils/helpers/cn";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          EudoxusBold.variable,
          EudoxusExtraBold.variable,
          EudoxusLight.variable,
          EudoxusMedium.variable,
          EudoxusRegular.variable,
          "antialiased",
        )}
      >
        <AnimationProvider>{children}</AnimationProvider>
      </body>
    </html>
  );
}
