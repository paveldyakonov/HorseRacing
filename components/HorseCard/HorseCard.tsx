import { Horse, Jockey, Owner } from "@prisma/client";
import classes from "./HorseCard.module.scss";
import Link from "next/link";

type Props = {
  horse: {
    owner: Owner;
    jockey: Jockey;
  } & Horse;
};

export const HorseCard: React.FC<Props> = ({ horse }) => {
  return (
    <div className={classes.card}>
      <h3 className={classes.card__name}>
        Name:{" "}
        <Link href={`/horses/${horse.id}`}>
          <a>{horse.name}</a>
        </Link>
      </h3>
      <div>Gender: {horse.gender}</div>
      <div>Age: {horse.age}</div>
      <div>Owner: {horse.owner.name}</div>
      {horse.jockey && (
        <div>
          Jockey:{" "}
          <Link href={`/jockeys/${horse.jockey.id}`}>
            <a>{horse.jockey.name}</a>
          </Link>
        </div>
      )}
    </div>
  );
};
