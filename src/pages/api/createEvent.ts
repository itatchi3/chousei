import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { EditingTimeWidth } from 'src/atoms/eventState';
import superjson from 'superjson';
import { getPrifile } from 'src/liff/getProfile';

type SortedPossibleDate = {
  date: Date;
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
  idToken: string | null | undefined;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, sortedPossibleDates, idToken }: ReqestBody = superjson.parse(req.body);
  let count = 0;
  let registerPossibleDates: RegisterPossibleDate[] = [];
  sortedPossibleDates.map((possibleDate) => {
    const date = possibleDate.date;
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
  try {
    const { userId, userName, profileImg } = await getPrifile(idToken);

    // const userId = 'testId';
    // const userName = 'userName';
    // const profileImg = 'aaa';
    const result = await prisma.event.create({
      data: {
        name,
        description,
        possibleDates: {
          create: registerPossibleDates,
        },
        participants: {
          create: {
            isCreate: true,
            user: {
              connectOrCreate: {
                where: {
                  id: userId,
                },
                create: {
                  id: userId,
                  name: userName,
                  profileImg: profileImg,
                },
              },
            },
          },
        },
      },
    });
    res.json({ ok: true, id: result.id });
  } catch (error) {
    console.error(error);
    res.json({ ok: false, error });
  }
}