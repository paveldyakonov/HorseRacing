import React, { useState } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { Horse, Jockey, Owner, Result, Competition } from "@prisma/client";
import { CompetitionCard } from "@/components/CompetitionCard";
import classes from "../styles/createCompetition.module.scss";
import Head from "next/head";
import Select from "react-select";
import { useRouter } from "next/router";
import { showDangerToast, showSuccessToast } from "utils/showToast";

type Props = {
  horses: ({
    jockey: Jockey;
  } & Horse)[];
  horsesList: {
    value: string;
    label: string;
  }[];
};

export default function CreateCompetitionPage({ horses, horsesList }: Props) {
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [time, setTime] = useState("2023-11-20T15:30:00");
  const [selectedHorses, setSelectedHorses] = useState<any>();
  const router = useRouter();

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const newTime = new Date(time);
      const timeForPrisma = newTime.toISOString();
      const body = { name, place, time: timeForPrisma, horses: selectedHorses };
      await fetch("/api/competition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((res) => {
          res
            ? showSuccessToast("Competition was added!")
            : showDangerToast("Something was wrong!");
        })
        .catch((err) => {
          showDangerToast("Something was wrong!");
        });

      await router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  function handleHorseSelect(data) {
    setSelectedHorses(data);
    console.log(data);
  }

  return (
    <>
      <Head>
        <title>Horses | Create competition</title>
      </Head>
      <div className="page">
        <h1>Create competition</h1>
        <main>
          <form onSubmit={submitData}>
            <h1>New Competition</h1>
            <input
              autoFocus
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              type="text"
              value={name}
            />
            <input
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Place"
              type="text"
              value={place}
            />
            <input
              onChange={(e) => setTime(e.target.value)}
              type="datetime-local"
              id="meeting-time"
              name="meeting-time"
              value={time}
            />
            <Select
              options={horsesList}
              placeholder="Select horses"
              value={selectedHorses}
              onChange={handleHorseSelect}
              isSearchable={true}
              isMulti
            />
            <input
              disabled={!name || !place || !selectedHorses || !selectedHorses.length}
              type="submit"
              value="Create"
            />
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const horses = await prisma.horse.findMany({
    include: {
      jockey: true,
    },
  });

  const horsesList = horses.map((horse) => ({ value: horse.id, label: horse.name }));

  return {
    props: {
      horses: JSON.parse(JSON.stringify(horses)),
      horsesList,
    },
  };
};
