import React, { useState } from "react";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { Horse, Jockey, Owner, Result, Competition, Gender } from "@prisma/client";
import { CompetitionCard } from "@/components/CompetitionCard";
import classes from "../styles/createCompetition.module.scss";
import Head from "next/head";
import Select from "react-select";
import { useRouter } from "next/router";
import { showDangerToast, showSuccessToast } from "utils/showToast";

type Props = {
  horsesList: {
    value: string;
    label: string;
  }[];
  jockeysAges: {
    value: string;
    label: string;
  }[];
};

export default function CreateJockeyPage({ horsesList, jockeysAges }: Props) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState<any>();
  const [selectedHorse, setSelectedHorse] = useState<any>();
  const router = useRouter();

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = {
        name,
        age,
        address,
        horse: selectedHorse,
      };
      await fetch("/api/jockey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((res) => {
          res ? showSuccessToast("Jockey was added!") : showDangerToast("Something was wrong!");
        })
        .catch((err) => {
          showDangerToast("Something was wrong!");
        });

      await router.push("/jockeys");
    } catch (error) {
      console.error(error);
    }
  };

  function handleHorseSelect(data) {
    setSelectedHorse(data);
    console.log(data);
  }

  function handleAgeSelect(data) {
    setAge(data);
    console.log(data);
  }

  return (
    <>
      <Head>
        <title>Horses | Create jockey</title>
      </Head>
      <div className="page">
        <h1>Create jockey</h1>
        <main>
          <form onSubmit={submitData}>
            <h1>New Jockey</h1>
            <input
              autoFocus
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              type="text"
              value={name}
            />
            <input
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              type="text"
              value={address}
            />
            <Select
              options={jockeysAges}
              placeholder="Select age"
              value={age}
              onChange={handleAgeSelect}
              isSearchable={true}
            />
            <Select
              options={horsesList}
              placeholder="Select horse"
              value={selectedHorse}
              onChange={handleHorseSelect}
              isSearchable={true}
            />
            <input disabled={!name || !age || !address} type="submit" value="Create" />
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const accessHorses = await prisma.horse.findMany({
    where: {
      jockey: null,
    },
  });

  const jockeysAges = [];
  for (let i = 16; i < 80; i++) {
    jockeysAges.push({
      value: i,
      label: i,
    });
  }

  const horsesList = accessHorses.map((horse) => ({ value: horse.id, label: horse.name }));

  return {
    props: {
      horsesList,
      jockeysAges,
    },
  };
};
