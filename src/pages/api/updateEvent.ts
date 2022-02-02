import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';
import superjson from 'superjson';
import { Prisma, PossibleDate } from '.prisma/client';

type RegisterPossibleDate = {
  id?: number;
  index: number;
  date: Date;
  dateString: string;
  startTime: Date;
  endTime: Date;
  timeWidthString: string;
};

type ReqestBody = {
  name: string;
  description: string;
  registerPossibleDates: RegisterPossibleDate[];
  eventId: string;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, registerPossibleDates, eventId }: ReqestBody = superjson.parse(
    req.body,
  );

  let previousPossibleDates: PossibleDate[] = [];

  try {
    previousPossibleDates = await prisma.possibleDate.findMany({
      where: {
        eventId: eventId,
      },
    });
  } catch {
    res.json({ ok: false, error: `eventIdError` });
    return;
  }

  let dateCheckArray: boolean[] = Array(previousPossibleDates.length).fill(false);

  registerPossibleDates.map((registerPossibleDate) => {
    previousPossibleDates.map((previousPossibleDate, index) => {
      if (
        registerPossibleDate.startTime.getTime() === previousPossibleDate.startTime.getTime() &&
        registerPossibleDate.endTime.getTime() === previousPossibleDate.endTime.getTime()
      ) {
        registerPossibleDate.id = previousPossibleDate.id;
        dateCheckArray[index] = true;
      }
    });
  });

  const deletePreviousPossibleDates = previousPossibleDates.filter(
    (_, index) => !dateCheckArray[index],
  );

  const deletePossibleDates = deletePreviousPossibleDates.map(
    async (deletePreviousPossibleDate) => {
      await prisma.possibleDate.delete({
        where: {
          id: deletePreviousPossibleDate.id,
        },
      });
    },
  );

  const upsertPossibleDates = registerPossibleDates.map(async (possibleDate) => {
    if (possibleDate.id) {
      await prisma.possibleDate.update({
        where: {
          id: possibleDate.id,
        },
        data: {
          index: possibleDate.index,
        },
      });
    } else {
      await prisma.possibleDate.create({
        data: {
          index: possibleDate.index,
          date: possibleDate.date,
          dateString: possibleDate.dateString,
          startTime: possibleDate.startTime,
          endTime: possibleDate.endTime,
          timeWidthString: possibleDate.timeWidthString,
          eventId: eventId,
        },
      });
    }
  });

  const updateDiscription = async () => {
    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        name: name,
        description: description,
      },
    });
  };

  try {
    await Promise.all([...deletePossibleDates, ...upsertPossibleDates, updateDiscription()]);

    res.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.json({ ok: false, error: `[${error.code}] ${error.message}` });
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      res.json({ ok: false, error: `[UnknownRequest] ${error.message}` });
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      res.json({ ok: false, error: `[RustPanic] ${error.message}` });
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      res.json({ ok: false, error: `[${error.errorCode}] ${error.message}` });
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      res.json({ ok: false, error: `[Validation] ${error.message}` });
    } else {
      res.json({ ok: false, error: `An unexpected error has occurred.` });
    }
  }
}
