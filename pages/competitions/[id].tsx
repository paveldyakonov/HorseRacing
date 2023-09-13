import React, { useState } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { Horse, Jockey, Owner, Result, Competition, Gender } from "@prisma/client";
import { CompetitionCard } from "@/components/CompetitionCard";
import classes from "../../styles/createCompetition.module.scss";
import Head from "next/head";
import Select from "react-select";
import { useRouter } from "next/router";
import { showDangerToast, showSuccessToast } from "utils/showToast";

type Props = {
  competition: {
    horses: ({
      jockey: Jockey;
    } & Horse)[];
  } & Competition;
  placesList: {
    value: String;
    label: String;
  }[];
  allHorses: Object;
};

export default function addResults({ competition, placesList, allHorses }: Props) {
  const [horsesMap, setHorsesMap] = useState(allHorses);

  const onPlaceChangeHandler = (e: React.ChangeEvent<HTMLInputElement>, horseId: String) => {
    const newMap = JSON.parse(JSON.stringify(horsesMap));
    newMap[`${horseId}`].place = e.target.value;
    console.log(newMap);
    setHorsesMap(newMap);
  };

  const onTimeChangeHandler = (e: React.ChangeEvent<HTMLInputElement>, horseId: String) => {
    const newMap = JSON.parse(JSON.stringify(horsesMap));
    newMap[`${horseId}`].timeValue = e.target.value;
    console.log(newMap);

    setHorsesMap(newMap);
  };

  const router = useRouter();

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = {
        horses: horsesMap,
        allHorsesList: competition.horses,
      };
      await fetch(`/api/competition/${competition.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((res) => {
          res ? showSuccessToast("Results were added!") : showDangerToast("Something was wrong!");
        })
        .catch((err) => {
          showDangerToast("Something was wrong!");
        });

      await router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Horses | {competition.name}</title>
      </Head>
      <div className="page">
        <h1>Add results - {competition.name}</h1>
        <main>
          <form onSubmit={submitData}>
            {competition.horses.map((horse) => (
              <div key={horse.id} className={classes.result}>
                <div>{horse.name}</div>
                <div>{horse.jockey.name}</div>
                <input
                  value={horsesMap[horse.id].place ?? ""}
                  onChange={(e) => onPlaceChangeHandler(e, horse.id)}
                  placeholder="Input Place"
                  type="text"
                />
                <input
                  value={horsesMap[horse.id].timeValue ?? ""}
                  onChange={(e) => onTimeChangeHandler(e, horse.id)}
                  placeholder="Input Time"
                  type="text"
                />
              </div>
            ))}
            <input type="submit" value="Create" />
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const competition = await prisma.competition.findUnique({
    where: {
      id: String(query.id),
    },
    include: {
      horses: {
        include: {
          jockey: true,
        },
      },
    },
  });

  const placesList = competition.horses.map((horse, index) => ({
    value: String(horse.id),
    label: String(index + 1),
  }));

  const allHorses = {};
  for (const horse of competition.horses) {
    allHorses[horse.id] = {
      place: null,
      timeValue: null,
    };
  }

  return {
    props: {
      competition: JSON.parse(JSON.stringify(competition)),
      placesList,
      allHorses,
    },
  };
};
