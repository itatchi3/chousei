import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';
import superjson from 'superjson';
import { Prisma } from '.prisma/client';
import { EventType } from 'src/atoms/eventState';

type ReqestBody = {
  id: string;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id }: ReqestBody = JSON.parse(req.body);

  let eventData: EventType;
  try {
    eventData = await prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        possibleDates: {
          orderBy: {
            index: 'asc',
          },
          include: {
            votes: {
              orderBy: {
                updatedAt: 'asc',
              },
            },
          },
        },
        comments: {
          orderBy: {
            updatedAt: 'asc',
          },
          include: {
            user: true,
          },
        },
        participants: {
          orderBy: {
            updatedAt: 'asc',
          },
          include: {
            user: true,
          },
        },
      },
    });

    if (!eventData) {
      throw new Error('EventDate undefined');
    }

    const attendanceCounts = eventData.possibleDates.map((possibleDate) => {
      return {
        date: possibleDate.date,
        positiveCount:
          possibleDate.votes !== undefined
            ? possibleDate.votes.filter((_vote) => _vote.vote === '○').length
            : 0,
        evenCount:
          possibleDate.votes !== undefined
            ? possibleDate.votes.filter((_vote) => _vote.vote === '△').length
            : 0,
        negativeCount:
          possibleDate.votes !== undefined
            ? possibleDate.votes.filter((_vote) => _vote.vote === '×').length
            : 0,
        votescount: possibleDate.votes.length,
      };
    });

    const scores = attendanceCounts.map((count) => {
      return count.positiveCount * 2 + count.evenCount;
    });
    const evaluations = scores.map((score, index) => {
      let color = 'white';
      const ratio = score / (attendanceCounts[index].votescount * 2);
      if (ratio === 1) {
        color = 'green.200';
      } else if (ratio > 0.7) {
        color = 'green.100';
      }
      return color;
    });

    const eventDetailData = {
      eventData,
      counts: attendanceCounts,
      colors: evaluations,
    };

    const eventDetailJson = superjson.stringify(eventDetailData);

    res.json({ ok: true, eventDetailData: eventDetailJson });
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
