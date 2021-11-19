import { database } from 'src/utils/firebase';
import { EventType } from 'src/atoms/eventState';
import { GetServerSideProps } from 'next';
import { EventDetail } from 'src/components/page/EventDetail';

type Props = {
  eventId: string;
  eventData: EventType;
};

const Event = (props: Props) => {
  return <EventDetail eventId={props.eventId} eventData={props.eventData} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const eventId = context.query.id;
  const ref = database.ref(`events/${eventId}`);

  return ref.once('value').then((snapshot) => {
    const eventData = snapshot.val();
    return { props: { eventId, eventData } };
  });
};
export default Event;
