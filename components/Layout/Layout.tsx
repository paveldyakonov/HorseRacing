import React, { ReactNode } from "react";
import { Header } from "@/components/Header";
import classes from "./Layout.module.scss";

type Props = {
  children: ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => (
  <div>
    <Header />
    <div className={classes.layout}>{children}</div>
  </div>
);
