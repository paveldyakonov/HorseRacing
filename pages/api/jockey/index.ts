import prisma from "@/lib/prisma";

export default async function handle(req, res) {
  const { name, age, address, horse } = req.body;

  let result = null;

  if (horse) {
    result = await prisma.jockey.create({
      data: {
        name: name,
        age: age.value,
        address: address,
        horse: {
          connect: { id: horse.value },
        },
      },
    });
  } else {
    result = await prisma.jockey.create({
      data: {
        name: name,
        age: age.value,
        address: address,
      },
    });
  }
  return res.json(result);
}
