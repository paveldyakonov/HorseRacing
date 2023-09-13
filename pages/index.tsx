import React from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { Horse, Jockey, Owner, Result, Competition } from "@prisma/client";
import { CompetitionCard } from "@/components/CompetitionCard";
import classes from "../styles/index.module.scss";
import Head from "next/head";
import { useRouter } from "next/router";

type Props = {
  competitions: ({
    results: ({
      jockey: Jockey;
      horse: Horse;
    } & Result)[];
    horses: ({
      jockey: Jockey;
    } & Horse)[];
  } & Competition)[];
};

export default function MainPage({ competitions }: Props) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Horses | Competitions</title>
      </Head>
      <div className="page">
        <h1>All competitions</h1>
        <button className={classes.btn} onClick={(e) => router.push("/createCompetition")}>
          Add Competition
        </button>
        <main>
          <div className={classes.competitions_list}>
            {competitions.map((competition) => (
              <div key={competition.id}>
                <CompetitionCard competition={competition} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  let competitions = await prisma.competition.findMany({
    include: {
      results: {
        include: {
          horse: true,
          jockey: true,
        },
        orderBy: {
          place: "asc",
        },
      },
      horses: {
        include: {
          jockey: true,
        },
      },
    },
  });

  return {
    props: {
      competitions: JSON.parse(JSON.stringify(competitions)),
    },
  };
};
