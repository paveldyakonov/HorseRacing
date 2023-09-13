import prisma from "@/lib/prisma";
import { Competition, Horse, Jockey, Owner, Result } from "@prisma/client";
import { GetServerSideProps } from "next";
import classes from "../../styles/oneHorsePage.module.scss";
import { HorseCard } from "@/components/HorseCard";
import Head from "next/head";
import { CompetitionCard } from "@/components/CompetitionCard";
import { JockeyCard } from "@/components/JockeyCard";

type Props = {
  jockey: {
    horse: Horse;
    competitions: ({
      results: ({
        jockey: Jockey;
        horse: Horse;
      } & Result)[];
      horses: ({
        jockey: Jockey;
      } & Horse)[];
    } & Competition)[];
  } & Jockey;
};

export default function OneJockeyPage({ jockey }: Props) {
  return (
    <>
      <Head>
        <title>Jockeys | {jockey.name}</title>
      </Head>
      <div className={classes.page}>
        <main className={classes.content}>
          <h1>Jockey - {jockey.name}</h1>
          <div>
            <JockeyCard jockey={jockey} />
          </div>
          <h2>Competitions List:</h2>
          <div className={classes.competitions_list}>
            {jockey.competitions &&
              jockey.competitions.map((competition) => (
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
  const jockey = await prisma.jockey.findUnique({
    where: {
      id: String(query.id),
    },
    include: {
      horse: true,
      competitions: {
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
      },
    },
  });

  if (!jockey) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      jockey: JSON.parse(JSON.stringify(jockey)),
    },
  };
};
