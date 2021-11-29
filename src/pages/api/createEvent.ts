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

  let hrstart = process.hrtime();

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

  let hrend = process.hrtime(hrstart);
  console.info('データ整形 (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
  try {
    hrstart = process.hrtime();

    const { userId, userName, profileImg } = await getPrifile(idToken);

    hrend = process.hrtime(hrstart);
    console.info('idToken認証 (hr): %ds %dms', hrend[0], hrend[1] / 1000000);

    hrstart = process.hrtime();

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

    hrend = process.hrtime(hrstart);
    console.info('planetscale (hr): %ds %dms', hrend[0], hrend[1] / 1000000);

    res.json({ ok: true, id: result.id });
  } catch (error) {
    console.error(error);
    res.json({ ok: false, error });
  }
}
