"use client";

import Image from "next/image";
import Link from "next/link";
import { Twitter, Linkedin, Youtube, Facebook } from "lucide-react";

const Footer = () => {
  const socialIcons = [
    { icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
    { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn" },
    { icon: <Youtube className="w-5 h-5" />, label: "YouTube" },
    { icon: <Facebook className="w-5 h-5" />, label: "Facebook" },
  ];

  const productLinks = [
    "Features",
    "Pricing",
    "Customers",
    "What's new",
    "Roadmap",
    "Feature requests",
    "Templates",
    "Integrations",
    "Words from our users",
    "Status",
  ];

  const helpLinks = [
    "Get started",
    "How-to guides",
    "Help center",
    "Contact support",
    "Hire an expert",
    "Report abuse",
  ];

  const companyLinks = ["About us", "Blog", "Media kit"];

  const resourceLinks = [
    "Join the community",
    "Referral program",
    "Fair use policy",
    "GDPR",
    "Terms & Privacy",
  ];

  return (
    <footer className="mt-32 px-4 sm:px-8 lg:px-24 mb-12">
      <div className="border-t border-gray-200 pt-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Image src="/logo.png" alt="logo" width={48} height={48} />
            <div className="mt-6 flex gap-4 text-gray-600">
              {socialIcons.map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  aria-label={item.label}
                  className="hover:text-gray-900 transition"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          <FooterColumn title="Product" links={productLinks} />

          <div className="space-y-8">
            <FooterColumn title="Help" links={helpLinks} />
            <FooterColumn title="Company" links={companyLinks} />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }: { title: string; links: string[] }) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    {links.map((label, index) => (
      <Link
        key={index}
        href="#"
        className="text-sm text-gray-600 hover:text-gray-900 transition"
      >
        {label}
      </Link>
    ))}
  </div>
);

export default Footer;
