import { EventType } from 'src/atoms/eventState';
import { GetServerSideProps } from 'next';
import { EventDetail } from 'src/components/page/EventDetail';
import { prisma } from 'lib/prisma';
import superjson from 'superjson';
import { useLiff } from 'src/liff/auth';
import { useEffect } from 'react';

type Props = {
  eventData: string;
};

const Event = (props: Props) => {
  const eventData: EventType = superjson.parse(props.eventData);
  const { idToken } = useLiff();

  useEffect(() => {
    const createParticipate = async () => {
      if (!eventData || !idToken) return;
      try {
        await fetch('/api/createParticipate', {
          method: 'POST',
          body: JSON.stringify({ idToken, eventId: eventData.id }),
        });
      } catch (error) {
        alert(error);
      }
    };
    createParticipate();
  }, [eventData, idToken]);

  return <EventDetail eventData={eventData} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  try {
    if (typeof id === 'string') {
      const eventData = await prisma.event.findUnique({
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
      return {
        props: { eventData: superjson.stringify(eventData) },
      };
    } else {
      throw new Error();
    }
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
export default Event;
