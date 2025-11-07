import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";

const SocialLinks = () => {
  const socialLinks = [
    {
      icon: <FaGithub className="h-5 w-5" />,
      href: "https://github.com/amangit1314",
      label: "GitHub",
    },
    {
      icon: <FaXTwitter className="h-5 w-5" />,
      href: "https://twitter.com/Hulk131469",
      label: "Twitter",
    },
    {
      icon: <FaLinkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/in/aman-soni1",
      label: "LinkedIn",
    },
    {
      icon: <RiInstagramFill className="h-5 w-5" />,
      href: "https://www.instagram.com/soni.amanic/",
      label: "Instagram",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {socialLinks.map((link, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={link.href}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-zinc-700 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
            aria-label={link.label}
          >
            {link.icon}
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default SocialLinks;
