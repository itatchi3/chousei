import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';
import { getPrifile } from 'src/liff/getProfile';
import { Prisma } from '.prisma/client';

type ReqestBody = {
  eventId: string;
  idToken: string;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { eventId, idToken }: ReqestBody = JSON.parse(req.body);

  let userId = '';
  let userName = '';
  let profileImg = '';

  try {
    const userProfile = await getPrifile(idToken);
    userId = userProfile.userId;
    userName = userProfile.userName;
    profileImg = userProfile.profileImg;
  } catch {
    res.json({ ok: false, error: `idTokenError` });
    return;
  }

  try {
    await prisma.user.upsert({
      where: {
        id: userId,
      },

      update: {
        name: userName,
        profileImg: profileImg,
      },
      create: {
        id: userId,
        name: userName,
        profileImg: profileImg,
      },
    });

    await prisma.eventParticipant.upsert({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId,
        },
      },
      update: {},
      create: {
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
