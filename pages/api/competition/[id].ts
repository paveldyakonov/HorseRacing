import prisma from "@/lib/prisma";

const Points = {
  1: 3,
  2: 2,
  3: 1,
};

export default async function handle(req, res) {
  const { horses, allHorsesList } = req.body;
  const { id } = req.query;

  const result = await Promise.all(
    allHorsesList.map(async (horse) => {
      await prisma.result.create({
        data: {
          place: Number(horses[horse.id].place),
          timeResult: Number(horses[horse.id].timeValue),
          competition: {
            connect: {
              id: id,
            },
          },
          jockey: {
            connect: {
              id: horse.jockey.id,
            },
          },
          horse: {
            connect: {
              id: horse.id,
            },
          },
        },
      });
      await prisma.jockey.update({
        where: {
          id: horse.jockey.id,
        },
        data: {
          points: {
            increment: Points[`${horses[horse.id].place}`] ?? 0,
          },
        },
      });
    }),
  );

  return res.json(result);
}
