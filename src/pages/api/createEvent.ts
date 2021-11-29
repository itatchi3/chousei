import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
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
  idToken: string | null | undefined;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { name, description, registerPossibleDates, idToken }: ReqestBody = superjson.parse(
    req.body,
  );

  console.log(registerPossibleDates);

  let userId = '';
  let userName = '';
  let profileImg = '';
  try {
    const userProfile = await getPrifile(idToken);
    console.log('userProfile');
    userId = userProfile.userId;
    userName = userProfile.userName;
    profileImg = userProfile.profileImg;
  } catch {
    res.json({ ok: false, error: `idTokenError` });
  }
  console.log(userName);
  console.log(profileImg);
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
    // if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //   res.json({ ok: false, error: `[${error.code}] ${error.message}` });
    // } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    //   res.json({ ok: false, error: `[UnknownRequest] ${error.message}` });
    // } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    //   res.json({ ok: false, error: `[RustPanic] ${error.message}` });
    // } else if (error instanceof Prisma.PrismaClientInitializationError) {
    //   res.json({ ok: false, error: `[${error.errorCode}] ${error.message}` });
    // } else if (error instanceof Prisma.PrismaClientValidationError) {
    //   res.json({ ok: false, error: `[Validation] ${error.message}` });
    // }

    res.json({ ok: false, error: `An unexpected error has occurred.` });
  }
}
