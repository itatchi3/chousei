import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Center,
  GridItem,
  SimpleGrid,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useLiff } from 'src/liff/auth';
import { EventType } from 'src/pages/api/getEventList';
import superjson from 'superjson';

export const EventList = () => {
  const { idToken, liff } = useLiff();
  const [isLoading, setIsLoading] = useState(true);
  const [eventList, setEventList] = useState<EventType[] | null>(null);
  const [avatarNumber, setAvatarNumber] = useState(0);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isEventLoadingArray, setIsEventLoadingArray] = useState<boolean[]>([]);

  const router = useRouter();

  const eventClick = (eventId: string, index: number) => {
    const newIsEventLoadingArray = isEventLoadingArray.map((_, i) => {
      if (i === index) {
        return true;
      } else {
        return false;
      }
    });
    setIsEventLoadingArray(newIsEventLoadingArray);
    router.push(`/event/${eventId}`);
  };

  const moveEventCreate = () => {
    setIsButtonLoading(true);
    router.push('/');
  };

  useEffect(() => {
    if (!idToken) return;
    const func = async () => {
      const res = await fetch(`/api/getEventList`, {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      });

      const json: { ok?: boolean; eventList?: string; error?: string } = await res.json();
      if (json.ok) {
        if (json.eventList) {
          const eventListData: EventType[] = superjson.parse(json.eventList);
          setEventList(eventListData);
          setIsEventLoadingArray(Array(eventListData.length).fill(false));
          setIsLoading(false);
        }
      } else {
        console.error(json.error);
      }
    };
    func();
  }, [idToken]);

  useEffect(() => {
    const handleResize = () => {
      const newAvatarNumber = Math.floor((window.innerWidth - 42) / 32 - 1);
      setAvatarNumber(newAvatarNumber);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <>
      {isLoading || !liff ? (
        <Center p="8">
          <Spinner color="green.400" />
        </Center>
      ) : (
        <Box p="3">
          <Box fontWeight="bold" fontSize="xl" pb="2">
            直近閲覧したイベント(最大5件)
          </Box>
          {eventList ? (
            <VStack>
              {eventList.map(
                (event, index) =>
                  event && (
                    <Box
                      key={event.id}
                      borderWidth="2px"
                      borderRadius="lg"
                      w="100%"
                      p="3"
                      onClick={() => {
                        eventClick(event.id, index);
                      }}
                      position="relative"
                    >
                      <Box fontWeight="bold" fontSize="lg" pb="2">
                        {event.name}
                      </Box>
                      <Box pb="2">{event.description}</Box>
                      <AvatarGroup size="sm" max={avatarNumber} spacing="-2px" pb="3">
                        {event.participants
                          .filter((participant) => participant.isVote === true)
                          .map((participant) => (
                            <Avatar
                              key={participant.userId}
                              name={participant.user.name}
                              src={participant.user.profileImg}
                            />
                          ))}
                      </AvatarGroup>
                      <SimpleGrid columns={3} spacing="2px 2%">
                        {event.possibleDates.map((possibleDate) => (
                          <GridItem key={possibleDate.id}>
                            <Center
                              borderWidth="1px"
                              fontSize="xs"
                              w="100%"
                              overflow="hidden"
                              borderRadius="sm"
                            >
                              <Box mx="auto">
                                {possibleDate.dateString}
                                <br />
                                {possibleDate.timeWidthString}
                              </Box>
                            </Center>
                          </GridItem>
                        ))}
                      </SimpleGrid>
                      {isEventLoadingArray[index] && (
                        <Center
                          background="rgba(0,0,0,0.2)"
                          position="absolute"
                          top="0"
                          right="0"
                          left="0"
                          bottom="0"
                        >
                          <Spinner color="green.400" thickness="6px" size="xl" />
                        </Center>
                      )}
                    </Box>
                  ),
              )}
            </VStack>
          ) : (
            <Center p="3">
              <Box borderWidth="2px" borderRadius="lg" w="300px" textAlign="center" p="2">
                閲覧したイベントが存在しません。
              </Box>
            </Center>
          )}

          <Center py="6">
            <Button onClick={() => moveEventCreate()} isLoading={isButtonLoading}>
              新しいイベントを作成する
            </Button>
          </Center>
        </Box>
      )}
    </>
  );
};
