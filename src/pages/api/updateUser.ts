import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';
import { getPrifile } from 'src/liff/getProfile';
import { Prisma } from '.prisma/client';

type ReqestBody = {
  idToken: string;
  eventId: string;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { idToken, eventId }: ReqestBody = JSON.parse(req.body);

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
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: userName,
        profileImg: profileImg,
      },
    });

    await prisma.eventParticipant.update({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId,
        },
      },
      data: {
        isCheck: true,
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
