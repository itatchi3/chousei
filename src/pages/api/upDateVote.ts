import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';
import { getPrifile } from 'src/liff/getProfile';
import { Prisma } from '.prisma/client';

type ReqestBody = {
  voteList: { id: number; vote: string }[];
  eventId: string;
  idToken: string;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { voteList, eventId, idToken }: ReqestBody = JSON.parse(req.body);

  const { userId } = await getPrifile(idToken);

  try {
    await prisma.eventParticipant.upsert({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId,
        },
      },
      update: {
        isVote: true,
      },
      create: {
        isVote: true,
        event: {
          connect: {
            id: eventId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    await Promise.all(
      voteList.map(async (_vote) => {
        await prisma.vote.upsert({
          where: {
            possibleDateId_userId: {
              possibleDateId: _vote.id,
              userId: userId,
            },
          },
          update: {
            vote: _vote.vote,
          },
          create: {
            vote: _vote.vote,
            possibleDate: {
              connect: {
                id: _vote.id,
              },
            },
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });
      }),
    );

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
