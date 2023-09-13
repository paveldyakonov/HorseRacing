import prisma from "@/lib/prisma";
import { Competition, Horse, Jockey, Owner, Result } from "@prisma/client";
import { GetServerSideProps } from "next";
import classes from "../../styles/oneHorsePage.module.scss";
import { HorseCard } from "@/components/HorseCard";
import Head from "next/head";
import { CompetitionCard } from "@/components/CompetitionCard";

type Props = {
  horse: {
    owner: Owner;
    jockey: Jockey;
    competitions: ({
      results: ({
        jockey: Jockey;
        horse: Horse;
      } & Result)[];
      horses: ({
        jockey: Jockey;
      } & Horse)[];
    } & Competition)[];
  } & Horse;
};

export default function OneHorsePage({ horse }: Props) {
  return (
    <>
      <Head>
        <title>Horses | {horse.name}</title>
      </Head>
      <div className={classes.page}>
        <main className={classes.content}>
          <h1>Horse - {horse.name}</h1>
          <div className={classes.horse_card}>
            <HorseCard horse={horse} />
          </div>
          <h2>Competitions List:</h2>
          <div className={classes.competitions_list}>
            {horse.competitions &&
              horse.competitions.map((competition) => (
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
  const horse = await prisma.horse.findUnique({
    where: {
      id: String(query.id),
    },
    include: {
      owner: true,
      jockey: true,
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

  if (!horse) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      horse: JSON.parse(JSON.stringify(horse)),
    },
  };
};
