import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import classes from "./Header.module.scss";

type Link = {
  url: string;
  name: string;
};

const links: Link[] = [
  {
    url: "/",
    name: "Main",
  },
  {
    url: "/horses",
    name: "Horses",
  },
  {
    url: "/jockeys",
    name: "Jockeys",
  },
];

export const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) => router.pathname === pathname;

  return (
    <nav className={classes.header}>
      {links.map((link) => (
        <div key={`${link.url}${link.name}`} className={classes.link}>
          <Link href={link.url}>
            <a className="bold" data-active={isActive(link.url)}>
              {link.name}
            </a>
          </Link>
        </div>
      ))}
    </nav>
  );
};
