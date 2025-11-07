import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaSquareXTwitter, FaYoutube } from "react-icons/fa6";
import Newsletter from "./newsletter";
import { SiDiscord, SiDribbble, SiGithub, SiLinkedin } from "react-icons/si";
import { dmSans, poppins } from "@/lib/config/fonts";

// Constants for better maintainability
const FOOTER_DATA = {
  quickLinks: [
    { link: "/browse", name: "Courses" },
    { link: "/articles", name: "Articles" },
    { link: "/projects", name: "Projects" },
    { link: "/roadmaps", name: "Roadmaps" },
  ],
  helpLinks: [
    { link: "/feature-request", name: "Ask Feature" },
    { link: "/feedback", name: "Give Feedback" },
    { link: "/legal/helpAndSupport", name: "Help and Support" },
    { link: "mailto:gitaman818@gmail.com", name: "Contact Us" },
  ],
  legalLinks: [
    { link: "/changelog", name: "Changelog" },
    { link: "/legal/refund-policy", name: "Refund Policy" },
    { link: "/legal/privacy-policy", name: "Privacy Policy" },
    { link: "/legal/terms-and-conditions", name: "Terms & Conditions" },
    { link: "/license", name: "License" },
  ],
  socialLinks: [
    {
      href: "https://www.linkedin.com/in/aman-soni1",
      icon: SiLinkedin,
      label: "LinkedIn",
    },
    {
      href: "https://x.com/soni07_aman",
      icon: FaSquareXTwitter,
      label: "Twitter",
    },
    {
      href: "https://github.com/amangit1314",
      icon: SiGithub,
      label: "GitHub",
    },
  ],
  mobileAccordion: {
    help: [
      "Courses",
      "Articles",
      "Roadmaps",
      "Projects",
      "Ask Feature",
      "Give Feedback",
      "Help and Support",
      "Contact us on gitaman8481@gmail.com",
    ],
    about: ["About Page", "Newsletter"],
  },
};

// Reusable Components
const LogoSection = () => (
  <div className="flex flex-col space-y-4">
    <Link
      href="/"
      className="flex cursor-pointer items-center transition-all duration-200 hover:scale-105 hover:opacity-80"
    >
      <Image
        src="/assets/images/logo/coursewave-favicon-color.png"
        alt="CourseWave Logo"
        width={32}
        height={32}
        priority
        className="h-8 w-8 drop-shadow-md"
      />
      <span className={dmSans.className}>
        <p className="ml-2 text-lg font-extrabold capitalize tracking-tight text-blue-500">
          Coursewave
        </p>
      </span>
    </Link>
    <p className={`${poppins.className} max-w-xs text-sm text-slate-400`}>
      Code. Create. Collaborate. Learn modern tech stacks through real projects
      and join a vibrant community of builders and innovators.
    </p>
  </div>
);

const LinkSection = ({
  title,
  links,
}: {
  title: string;
  links: Array<{ link: string; name: string }>;
}) => (
  <div className="space-y-4">
    <p
      className={`${dmSans.className} text-sm font-bold uppercase tracking-tight text-slate-100`}
    >
      {title}
    </p>
    <ul className="flex list-none flex-col space-y-3">
      {links.map((item, index) => (
        <li key={index}>
          <Link
            href={item.link}
            className={`${poppins.className} text-sm tracking-tight text-slate-400 transition-colors duration-200 hover:text-blue-400`}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const SocialLinks = () => (
  <div className="flex items-center justify-center lg:justify-end">
    <div className="flex space-x-5">
      {FOOTER_DATA.socialLinks.map((social, index) => {
        const Icon = social.icon;
        return (
          <Link
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 transition-all duration-200 hover:scale-110 hover:text-blue-500"
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{social.label}</span>
          </Link>
        );
      })}
    </div>
  </div>
);

const LegalLinks = () => (
  <div className="flex flex-wrap items-center justify-center space-x-4 sm:justify-end">
    {FOOTER_DATA.legalLinks.map((link, index) => (
      <Link
        key={index}
        href={link.link}
        className={`${poppins.className} text-xs font-light text-slate-400 transition-colors duration-200 hover:text-blue-400`}
      >
        {link.name}
      </Link>
    ))}
  </div>
);

const CopyrightText = () => (
  <p
    className={`${poppins.className} text-center text-xs text-slate-100 sm:text-left`}
  >
    &copy; 2023{" "}
    <span className={dmSans.className}>
      <strong className="text-xs font-bold text-blue-500">Coursewave </strong>
    </span>{" "}
    by Aman Soni. All rights reserved.
  </p>
);

const MobileFooterAccordionSection = () => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="help">
      <AccordionTrigger
        className={`${dmSans.className} text-slate-100 hover:text-blue-400`}
      >
        Get Help
      </AccordionTrigger>
      <AccordionContent className="space-y-2 text-zinc-400">
        {FOOTER_DATA.mobileAccordion.help.map((point, index) => (
          <div
            key={index}
            className={`${poppins.className} cursor-pointer text-sm transition-colors duration-200 hover:text-blue-400`}
          >
            {point}
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="about">
      <AccordionTrigger
        className={`${dmSans.className} text-slate-100 hover:text-blue-400`}
      >
        About Coursewave
      </AccordionTrigger>
      <AccordionContent className="space-y-2 text-zinc-400">
        {FOOTER_DATA.mobileAccordion.about.map((point, index) => (
          <div
            key={index}
            className={`${poppins.className} cursor-pointer text-sm transition-colors duration-200 hover:text-blue-400`}
          >
            {point}
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

const DesktopLinksSection = () => (
  <div className="hidden lg:flex lg:space-x-12">
    <LinkSection title="Get Help" links={FOOTER_DATA.helpLinks} />
    <LinkSection title="Quick Links" links={FOOTER_DATA.quickLinks} />
  </div>
);

// Main Footer Components
export const CourseFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex h-auto w-full flex-col items-center justify-between border-t border-gray-200/80 bg-white/95 px-4 py-6 backdrop-blur-sm dark:border-gray-800/80 dark:bg-black/95 sm:flex-row sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col items-center space-y-4 sm:mb-0 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center transition-all duration-200 hover:scale-105 hover:opacity-80"
        >
          <Image
            src="/courseWaveFaviconColored.png"
            className="h-8 w-8 drop-shadow-sm"
            alt="Coursewave Logo"
            height={32}
            width={32}
          />
          <span
            className={`${dmSans.className} ml-2 text-sm font-bold text-blue-500 dark:text-blue-500 sm:text-base`}
          >
            CourseWave
          </span>
        </Link>

        {/* Copyright */}
        <div className="flex flex-col items-center space-y-1 text-center sm:flex-row sm:space-x-1 sm:space-y-0">
          <p
            className={`${poppins.className} text-sm text-gray-500 dark:text-gray-400`}
          >
            © {currentYear}
            <Link href="/" className="hover:text-blue-500 hover:underline">
              Coursewave™
            </Link>
            . All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Social Icons */}
      <SocialLinks />
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="w-full bg-zinc-900 text-slate-700">
      {/* Main Footer Content */}
      <div className="border-t border-neutral-700/60 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col space-y-8 lg:flex-row lg:items-start lg:justify-between lg:space-y-0 lg:space-x-12">
            {/* Logo and Links Section */}
            <div className="flex flex-col space-y-8 sm:flex-row sm:items-start sm:space-x-12 sm:space-y-0">
              <LogoSection />

              {/* Desktop Links */}
              <DesktopLinksSection />

              {/* Mobile Footer Accordion */}
              <div className="lg:hidden">
                <MobileFooterAccordionSection />
              </div>
            </div>

            {/* Social Icons */}
            <SocialLinks />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-neutral-700/60 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col-reverse items-center justify-between space-y-4 space-y-reverse sm:flex-row sm:space-y-0">
            <CopyrightText />
            <LegalLinks />
          </div>
        </div>
      </div>
    </footer>
  );
};
