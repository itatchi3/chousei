import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';
import superjson from 'superjson';
import { getPrifile } from 'src/liff/getProfile';
import { Prisma } from '.prisma/client';
import { Event, EventParticipant, User, PossibleDate } from '@prisma/client';

type EventType =
  | (Event & {
      participants: (EventParticipant & {
        user: User;
      })[];
      possibleDates: PossibleDate[];
    })
  | null;

type ReqestBody = {
  idToken: string | null | undefined;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { idToken }: ReqestBody = JSON.parse(req.body);

  let userId = '';
  try {
    const userProfile = await getPrifile(idToken);
    userId = userProfile.userId;
  } catch {
    res.json({ ok: false, error: `idTokenError` });
    return;
  }

  let eventList: EventType[];
  try {
    const eventIdList = await prisma.eventParticipant.findMany({
      where: {
        userId: userId,
        isCheck: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        eventId: true,
      },
    });

    if (eventIdList.length === 0) {
      res.json({ ok: true, eventList: null });
      return;
    }

    eventList = Array(eventIdList.length);

    const getEventList = eventIdList.map(async (eventId, index) => {
      eventList[index] = await prisma.event.findUnique({
        where: {
          id: eventId.eventId,
        },
        include: {
          participants: {
            orderBy: {
              updatedAt: 'asc',
            },
            include: {
              user: true,
            },
          },
          possibleDates: {
            orderBy: {
              index: 'asc',
            },
          },
        },
      });
    });

    await Promise.all(getEventList);

    const eventListJson = superjson.stringify(eventList.slice(0, 5));

    res.json({ ok: true, eventList: eventListJson });
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
