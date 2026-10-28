"use client";

import { usePathname } from "next/navigation";

// Access the Facebook Page ID / username from environment variables
const messengerId = process.env.NEXT_PUBLIC_MESSENGER_ID;

export default function MessengerButton() {
  const pathname = usePathname();

  // If the Messenger ID is missing or the user is on an admin page, do not render
  if (!messengerId || pathname.startsWith("/admin")) return null;

  return (
    <a
      href={`https://m.me/${messengerId}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on Messenger"
      className="fixed bottom-24 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#0084FF] shadow-lg hover:bg-[#006edd] transition-colors duration-200"
    >
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#0084FF] opacity-40 animate-ping" />
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-7 h-7"
        aria-hidden="true"
        fill="white"
      >
        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.088-2.242c1.09.302 2.245.464 3.44 .464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.08-3.287-6.012 3.287 6.608-7.019 3.14 3.287 5.952-3.287-6.608 7.019z" />
      </svg>
    </a>
  );
}