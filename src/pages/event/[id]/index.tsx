import { EventType } from 'src/atoms/eventState';
import { GetServerSideProps } from 'next';
import { EventDetail } from 'src/components/EventDetail/EventDetail';
import { prisma } from 'prisma/prisma';
import superjson from 'superjson';

type Props = {
  eventDetailData: string;
};

export type EventDetailType = {
  eventData: EventType;
  counts: Counts[];
  colors: string[];
};

type Counts = {
  date: Date;
  positiveCount: number;
  evenCount: number;
  negativeCount: number;
};

const Event = (props: Props) => {
  const eventDetailData: EventDetailType = superjson.parse(props.eventDetailData);

  return <EventDetail eventDetailData={eventDetailData} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  let eventData: EventType;
  try {
    if (typeof id === 'string') {
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
    } else {
      throw new Error('Query Error');
    }
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
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
    };
  });

  const scores = attendanceCounts.map((count) => {
    return count.negativeCount;
  });
  const min = Math.min(...scores);
  const evaluations = scores.map((score) => {
    return score === min ? 'green.100' : 'white';
  });

  const eventDetailData = {
    eventData,
    counts: attendanceCounts,
    colors: evaluations,
  };

  return {
    props: { eventDetailData: superjson.stringify(eventDetailData) },
  };
};
export default Event;
