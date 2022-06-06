import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';
import superjson from 'superjson';
import { Prisma } from '.prisma/client';

type ReqestBody = {
  id: string;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id }: ReqestBody = JSON.parse(req.body);

  try {
    const event = await prisma.event.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        possibleDates: {
          orderBy: {
            index: 'asc',
          },
          select: {
            id: true,
            index: true,
            eventId: true,
            date: true,
            dateString: true,
            startTime: true,
            endTime: true,
            timeWidthString: true,
            votes: {
              orderBy: {
                updatedAt: 'asc',
              },
              select: {
                vote: true,
                possibleDateId: true,
                userId: true,
              },
            },
          },
        },
        comments: {
          orderBy: {
            updatedAt: 'asc',
          },
          select: {
            comment: true,
            userId: true,
            user: {
              select: {
                name: true,
                profileImg: true,
              },
            },
          },
        },
        participants: {
          orderBy: {
            updatedAt: 'asc',
          },
          select: {
            userId: true,
            isCreate: true,
            isVote: true,
            isCheck: true,
            user: {
              select: {
                name: true,
                profileImg: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new Error('EventDate undefined');
    }

    const attendanceCounts = event.possibleDates.map((possibleDate) => {
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
      event,
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
