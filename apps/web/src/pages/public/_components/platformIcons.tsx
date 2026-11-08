import { Mail, Globe } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";

export const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  github: <FaGithub size={17} />,
  linkedin: <FaLinkedin size={17} />,
  twitter: <FaXTwitter size={17} />,
  x: <FaXTwitter size={17} />,
  instagram: <FaInstagram size={17} />,
  email: <Mail size={17} />,
  whatsapp: <FaWhatsapp size={17} />,
  website: <Globe size={17} />,
};
