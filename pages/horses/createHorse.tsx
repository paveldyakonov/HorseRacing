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
  ownersList: {
    value: string;
    label: string;
  }[];
  jockeysList: {
    value: string;
    label: string;
  }[];
  genderList: {
    value: Gender;
    label: Gender;
  }[];
  horsesAges: {
    value: string;
    label: string;
  }[];
};

export default function CreateHorsePage({
  jockeysList,
  ownersList,
  genderList,
  horsesAges,
}: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState<any>();
  const [selectedGender, setSelectedGender] = useState<any>();
  const [selectedOwner, setSelectedOwner] = useState<any>();
  const [selectedJockey, setSelectedJockey] = useState<any>();
  const router = useRouter();

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = {
        name,
        age,
        gender: selectedGender,
        owner: selectedOwner,
        jockey: selectedJockey,
      };
      await fetch("/api/horse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((res) => {
          res ? showSuccessToast("Horse was added!") : showDangerToast("Something was wrong!");
        })
        .catch((err) => {
          showDangerToast("Something was wrong!");
        });

      await router.push("/horses");
    } catch (error) {
      console.error(error);
    }
  };

  function handleOwnerSelect(data) {
    setSelectedOwner(data);
    console.log(data);
  }

  function handleJockeySelect(data) {
    setSelectedJockey(data);
    console.log(data);
  }

  function handleGenderSelect(data) {
    setSelectedGender(data);
    console.log(data);
  }

  function handleAgeSelect(data) {
    setAge(data);
    console.log(data);
  }

  return (
    <>
      <Head>
        <title>Horses | Create horse</title>
      </Head>
      <div className="page">
        <h1>Create horse</h1>
        <main>
          <form onSubmit={submitData}>
            <h1>New Horse</h1>
            <input
              autoFocus
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              type="text"
              value={name}
            />
            <Select
              options={horsesAges}
              placeholder="Select age"
              value={age}
              onChange={handleAgeSelect}
              isSearchable={true}
            />
            <Select
              options={jockeysList}
              placeholder="Select jockey"
              value={selectedJockey}
              onChange={handleJockeySelect}
              isSearchable={true}
            />
            <Select
              options={ownersList}
              placeholder="Select owner"
              value={selectedOwner}
              onChange={handleOwnerSelect}
              isSearchable={true}
            />
            <Select
              options={genderList}
              placeholder="Select gender"
              value={selectedGender}
              onChange={handleGenderSelect}
            />
            <input
              disabled={!name || !age || !selectedOwner || !selectedGender}
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
  const accessJockeys = await prisma.jockey.findMany({
    where: {
      horse: null,
    },
  });

  const owners = await prisma.owner.findMany();
  const ownersList = owners.map((owner) => ({ value: owner.id, label: owner.name }));
  const genderList = [
    {
      value: Gender.MAN,
      label: Gender.MAN,
    },
    {
      value: Gender.WOMAN,
      label: Gender.WOMAN,
    },
  ];

  const horsesAges = [];
  for (let i = 3; i < 25; i++) {
    horsesAges.push({
      value: i,
      label: i,
    });
  }

  const jockeysList = accessJockeys.map((jockey) => ({ value: jockey.id, label: jockey.name }));

  return {
    props: {
      //jockeys: JSON.parse(JSON.stringify(accessJockeys)),
      jockeysList,
      ownersList,
      genderList,
      horsesAges,
    },
  };
};
