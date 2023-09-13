import prisma from "@/lib/prisma";

export default async function handle(req, res) {
  const { name, place, time, horses } = req.body;
  const horsesForPrisma = horses.map((horse) => ({ id: horse.value }));
  const horsesIds = horses.map((horse) => horse.value);
  const jockeys = await prisma.jockey
    .findMany({
      where: {
        horse: {
          id: {
            in: horsesIds,
          },
        },
      },
    })
    .then((res) => res.map((jockey) => ({ id: jockey.id })))
    .catch((e) => {
      console.log(e);
      return [];
    });

  console.log(jockeys);

  const result = await prisma.competition.create({
    data: {
      name: name,
      datetime: time,
      place: place,
      horses: {
        connect: horsesForPrisma,
      },
      jockey: {
        connect: jockeys,
      },
    },
  });
  return res.json(result);
}
