import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getSeoOverride,
  seoOverrideToMetadata,
} from "@/lib/seo/getSeoOverride";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Company {
  name: string;
  privacyPolicy: string | null;
  metaTitle?: string | null;
}

async function getCompany(): Promise<Company | null> {
  try {
    const res = await fetch(`${API_URL}/company`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const [company, seoOverride] = await Promise.all([
    getCompany(),
    getSeoOverride("/privacy-policy"),
  ]);
  return seoOverrideToMetadata(seoOverride, {
    title: `Privacy Policy | ${company?.name ?? "Ondorkotha"}`,
  });
}

export default async function PrivacyPolicyPage() {
  const company = await getCompany();

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-8 py-16 text-[#222222]">
      <h1 className="text-3xl font-light mb-10">Privacy Policy</h1>
      {!company || !company.privacyPolicy ? (
        <p className="text-sm text-gray-500">
          No privacy policy available right now.
        </p>
      ) : null}
      <div
        className="prose-static"
        dangerouslySetInnerHTML={{ __html: company.privacyPolicy }}
      />
    </main>
  );
}
