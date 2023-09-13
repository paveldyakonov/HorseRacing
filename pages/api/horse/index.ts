import prisma from "@/lib/prisma";

export default async function handle(req, res) {
  const { name, age, gender, owner, jockey } = req.body;

  let result = null;

  if (jockey) {
    result = await prisma.horse.create({
      data: {
        name: name,
        age: age.value,
        gender: gender.value,
        owner: {
          connect: { id: owner.value },
        },
        jockey: {
          connect: { id: jockey.value },
        },
      },
    });
  } else {
    result = await prisma.horse.create({
      data: {
        name: name,
        age: age.value,
        gender: gender.value,
        owner: {
          connect: { id: owner.value },
        },
      },
    });
  }
  return res.json(result);
}
