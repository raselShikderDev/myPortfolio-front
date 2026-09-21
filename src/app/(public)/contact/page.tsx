import { Metadata } from "next";
import ContactPage from "./contact-client";

export const metadata: Metadata = {
  title: "Contact | Rasel Shikder",
  description: "Get in touch with Rasel Shikder for projects, collaborations, or inquiries.",
  openGraph: {
    title: "Contact | Rasel Shikder",
    description: "Get in touch with Rasel Shikder for projects, collaborations, or inquiries.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Rasel Shikder",
    description: "Get in touch with Rasel Shikder for projects, collaborations, or inquiries.",
  },
};

export default function Page() {
  return <ContactPage />;
}
