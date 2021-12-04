import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';
import superjson from 'superjson';
import { getPrifile } from 'src/liff/getProfile';
import { Prisma } from '.prisma/client';

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
  registerPossibleDates: RegisterPossibleDate[];
  accessToken: string | null | undefined;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, registerPossibleDates, accessToken }: ReqestBody = superjson.parse(
    req.body,
  );

  let userId = '';
  let userName = '';
  let profileImg = '';
  try {
    const userProfile = await getPrifile(accessToken);
    userId = userProfile.userId;
    userName = userProfile.userName;
    profileImg = userProfile.profileImg;
  } catch {
    res.json({ ok: false, error: `accessTokenError` });
    return;
  }
  try {
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
