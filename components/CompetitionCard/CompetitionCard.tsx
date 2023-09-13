import React from "react";
import classes from "./CompetitionCard.module.scss";
import { Competition, Horse, Jockey, Result } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  competition: {
    results: ({
      jockey: Jockey;
      horse: Horse;
    } & Result)[];
    horses: ({
      jockey: Jockey;
    } & Horse)[];
  } & Competition;
};

export const CompetitionCard: React.FC<Props> = ({ competition }) => {
  const router = useRouter();

  return (
    <div className={classes.card}>
      <div className={classes.name_and_time}>
        <h3 className={classes.card__name}>Name of Competition: {competition.name ?? "Anonim"}</h3>
        <h5>Place: {competition.place}</h5>
        <h5 className={classes.card__datetime}>
          DateTime: {new Date(competition.datetime).toString()}
        </h5>
      </div>
      {competition.results.length > 0 && (
        <div className={classes.card__results}>
          {competition.results.map((result, index) => (
            <div className={classes.result} key={result.id}>
              <p>{index + 1}.</p>
              <p>
                Horse:{" "}
                <Link href={`/horses/${result.horse.id}`}>
                  <a>{result.horse.name}</a>
                </Link>
              </p>
              <p>
                Jockey:{" "}
                <Link href={`/jockeys/${result.jockey.id}`}>
                  <a>{result.jockey.name}</a>
                </Link>
              </p>
              <p>Place: {result.place}</p>
              <p>Time: {result.timeResult}</p>
            </div>
          ))}
        </div>
      )}
      {competition.results.length === 0 && (
        <div className={classes.card__results}>
          {competition.horses.map((horse, index) => (
            <div className={classes.result} key={horse.id}>
              <p>{index + 1}.</p>
              <p>
                Horse:{" "}
                <Link href={`/horses/${horse.id}`}>
                  <a>{horse.name}</a>
                </Link>
              </p>
              {horse.jockey && (
                <p>
                  Jockey:{" "}
                  <Link href={`/jockeys/${horse.jockey.id}`}>
                    <a>{horse.jockey.name}</a>
                  </Link>
                </p>
              )}
            </div>
          ))}
          <p>
            <button onClick={(e) => router.push(`/competitions/${competition.id}`)}>
              Add results
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
