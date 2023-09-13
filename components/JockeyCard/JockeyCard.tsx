import { Horse, Jockey, Owner } from "@prisma/client";
import classes from "./JockeyCard.module.scss";
import Link from "next/link";

type Props = {
  jockey: {
    horse: Horse;
  } & Jockey;
};

export const JockeyCard: React.FC<Props> = ({ jockey }) => {
  return (
    <div className={classes.card}>
      <h3 className={classes.card__name}>
        Name:{" "}
        <Link href={`/jockeys/${jockey.id}`}>
          <a>{jockey.name}</a>
        </Link>
      </h3>
      <div>Address: {jockey.address}</div>
      <div>Age: {jockey.age}</div>
      <div>Points: {jockey.points}</div>
      {jockey.horse && (
        <div>
          Horse:{" "}
          <Link href={`/horses/${jockey.horse.id}`}>
            <a>{jockey.horse.name}</a>
          </Link>
        </div>
      )}
    </div>
  );
};
