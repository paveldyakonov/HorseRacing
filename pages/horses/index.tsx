import prisma from "@/lib/prisma";
import { Horse, Jockey, Owner } from "@prisma/client";
import { GetServerSideProps } from "next";
import classes from "../../styles/horses.module.scss";
import { HorseCard } from "@/components/HorseCard";
import Head from "next/head";
import { useRouter } from "next/router";

type Props = {
  horses: ({
    owner: Owner;
    jockey: Jockey;
  } & Horse)[];
};

export default function HorsesPage({ horses }: Props) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Horses | All horses</title>
      </Head>
      <div className="page">
        <h1>All Horses</h1>
        <button className={classes.btn} onClick={(e) => router.push("/horses/createHorse")}>
          Add Horse
        </button>
        <main>
          <div className={classes.horses}>
            {horses && horses.map((horse) => <HorseCard key={horse.id} horse={horse} />)}
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const horses = await prisma.horse.findMany({
    include: {
      owner: true,
      jockey: true,
    },
  });

  return {
    props: {
      horses: JSON.parse(JSON.stringify(horses)),
    },
  };
};
