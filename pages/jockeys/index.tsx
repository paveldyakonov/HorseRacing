import prisma from "@/lib/prisma";
import { Horse, Jockey, Owner } from "@prisma/client";
import { GetServerSideProps } from "next";
import classes from "../../styles/jockeys.module.scss";
import { HorseCard } from "@/components/HorseCard";
import Head from "next/head";
import { JockeyCard } from "@/components/JockeyCard";
import { useRouter } from "next/router";

type Props = {
  jockeys: ({
    horse: Horse;
  } & Jockey)[];
};

export default function JockeysPage({ jockeys }: Props) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Horses | All jockeys</title>
      </Head>
      <div className="page">
        <h1>All Jockeys</h1>
        <button className={classes.btn} onClick={(e) => router.push("/jockeys/createJockey")}>
          Add Jockey
        </button>
        <main>
          <div className={classes.jockeys}>
            {jockeys && jockeys.map((jockey) => <JockeyCard key={jockey.id} jockey={jockey} />)}
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const jockeys = await prisma.jockey.findMany({
    include: {
      horse: true,
    },
    orderBy: {
      points: "desc",
    },
  });

  return {
    props: {
      jockeys: JSON.parse(JSON.stringify(jockeys)),
    },
  };
};
