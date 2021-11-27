import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';

import { EditingTimeWidth } from 'src/atoms/eventState';

type SortedPossibleDate = {
  date: string;
  dateString: string;
  timeWidth: EditingTimeWidth[];
};

type RegisterPossibleDate = {
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
  sortedPossibleDates: SortedPossibleDate[];
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, sortedPossibleDates }: ReqestBody = req.body;
  let count = 0;
  let registerPossibleDates: RegisterPossibleDate[] = [];
  sortedPossibleDates.map((possibleDate) => {
    const date = new Date(possibleDate.date);
    possibleDate.timeWidth.map((timeWidth) => {
      const [startHour, startMinute] = timeWidth.start.split(':');
      const start = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        Number(startHour),
        Number(startMinute),
      );
      const [endHour, endMinute] = timeWidth.end.split(':');
      const end = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        Number(endHour),
        Number(endMinute),
      );
      if (timeWidth.stringTimeWidth) {
        registerPossibleDates.push({
          index: count,
          date: date,
          dateString: possibleDate.dateString,
          startTime: start,
          endTime: end,
          timeWidthString: timeWidth.stringTimeWidth,
        });
        count += 1;
      }
    });
  });

  const authorId = 'testId';
  const userName = 'testName';
  const profileImg = 'testImg';

  try {
    const result = await prisma.event.create({
      data: {
        name,
        description,
        possibleDates: {
          create: registerPossibleDates,
        },
        participants: {
          create: {
            status: 'create',
            user: {
              connectOrCreate: {
                where: {
                  id: authorId,
                },
                create: {
                  id: authorId,
                  name: userName,
                  profileImg: profileImg,
                },
              },
            },
          },
        },
      },
    });
    console.log(result);
    res.json({ ok: true, id: result.id });
    return;
  } catch (error) {
    console.log(error);
    res.json({ ok: false, error });
  }
}
