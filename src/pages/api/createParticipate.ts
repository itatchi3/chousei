import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { getPrifile } from 'src/liff/getProfile';

type ReqestBody = {
  voteList: { id: number; vote: string }[];
  eventId: string;
  idToken: string;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { eventId, idToken }: ReqestBody = JSON.parse(req.body);

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

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.json({ ok: false, error });
  }
}
