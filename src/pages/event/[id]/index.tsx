import { EventType } from 'src/atoms/eventState';
import { GetServerSideProps } from 'next';
import { EventDetail } from 'src/components/page/EventDetail';
import { prisma } from 'lib/prisma';
import superjson from 'superjson';
import { useLiff } from 'src/liff/auth';
import { useEffect } from 'react';

type Props = {
  attendanceTableData: string;
};

export type AttendanceTableData = {
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
  const attendanceTableData: AttendanceTableData = superjson.parse(props.attendanceTableData);
  const { idToken } = useLiff();

  useEffect(() => {
    const createParticipate = async () => {
      if (!attendanceTableData.eventData || !idToken) return;
      try {
        await fetch('/api/createParticipate', {
          method: 'POST',
          body: JSON.stringify({ idToken, eventId: attendanceTableData.eventData.id }),
        });
      } catch (error) {
        alert(error);
      }
    };
    createParticipate();
  }, [attendanceTableData, idToken]);

  return <EventDetail attendanceTableData={attendanceTableData} />;
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
    return count.positiveCount * 3 + count.evenCount * 2;
  });
  const max = Math.max(...scores);
  const evaluations = scores.map((score) => {
    return score === max && score > 0 ? 'green.100' : 'white';
  });

  const attendanceTableData = {
    eventData,
    counts: attendanceCounts,
    colors: evaluations,
  };

  return {
    props: { attendanceTableData: superjson.stringify(attendanceTableData) },
  };
};
export default Event;
