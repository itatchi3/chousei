import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';
import { getPrifile } from 'src/liff/getProfile';
import { Prisma } from '.prisma/client';

type ReqestBody = {
  comment: string;
  eventId: string;
  accessToken: string;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { comment, eventId, accessToken }: ReqestBody = JSON.parse(req.body);

  let userId = '';
  try {
    const userProfile = await getPrifile(accessToken);
    userId = userProfile.userId;
  } catch {
    res.json({ ok: false, error: `accessTokenError` });
    return;
  }

  try {
    await prisma.comment.upsert({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId,
        },
      },
      update: {
        comment: comment,
      },
      create: {
        comment: comment,
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
