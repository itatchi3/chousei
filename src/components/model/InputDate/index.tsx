import { useRecoilState } from 'recoil';
import { candidateDateState } from 'src/atoms/eventState';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import DayPicker, { DateUtils, DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { cloneDeep } from 'lodash';

type Props = {
  indexDate: number;
};

export const InputDate = ({ indexDate }: Props) => {
  const [candidateDates, setCandidateDates] = useRecoilState(candidateDateState);
  const candidateDate = candidateDates[indexDate];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dayOfWeekStr = ['日', '月', '火', '水', '木', '金', '土'];

  const handleDayClick = (day: Date, { selected }: DayModifiers, indexDate: number) => {
    const selectedDays = candidateDate.date.concat();
    if (selected) {
      const selectedIndex = selectedDays.findIndex((selectedDay) =>
        DateUtils.isSameDay(selectedDay, day),
      );
      selectedDays.splice(selectedIndex, 1);
    } else {
      selectedDays.push(day);
    }

    const sortedDates = selectedDays.sort((a, b) => {
      return a.valueOf() - b.valueOf();
    });

    const sortedDatesString = sortedDates.map(
      (date) => `${date.getMonth() + 1}/${date.getDate()}(${dayOfWeekStr[date.getDay()]})`,
    );

    const currentData = candidateDate;
    const newData = { ...currentData, date: sortedDates, dateString: sortedDatesString.join(', ') };
    const newState = cloneDeep(candidateDates);
    newState[indexDate] = newData;
    setCandidateDates(newState);
  };

  return (
    <FormControl isRequired>
      <Box my="1">
        <FormLabel fontWeight="bold" fontSize="sm">
          日付
        </FormLabel>
      </Box>
      <Input
        placeholder="タップしてください"
        defaultValue={candidateDates[indexDate].dateString}
        onClick={onOpen}
        readOnly
        sx={{
          WebkitTapHighlightColor: 'rgba(0,0,0,0)',
          _focus: { boxShadow: 'none' },
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            sx={{
              WebkitTapHighlightColor: 'rgba(0,0,0,0)',
              _focus: { boxShadow: 'none' },
            }}
          />
          <ModalHeader></ModalHeader>
          <ModalBody py="0" px="0">
            <Box>
              <DayPicker
                selectedDays={candidateDate.date}
                onDayClick={(day, modifires, e) => handleDayClick(day, modifires, indexDate)}
                weekdaysShort={['日', '月', '火', '水', '木', '金', '土']}
              />
              <style jsx global>{`
                .DayPicker-Day {
                  padding: 4px 8px;
                  margin: 2px;
                }
                .DayPicker {
                  font-size: 21px;
                  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                }
                .DayPicker-wrapper:focus {
                  outline: none;
                }
                .DayPicker-NavButton:focus {
                  outline: none;
                }
                .DayPicker-Day:focus {
                  outline: none;
                }
                .DayPicker:not(.DayPicker--interactionDisabled)
                  .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
                  background: none;
                }
                .DayPicker-Day--today {
                  color: #000000;
                }
              `}</style>
            </Box>
          </ModalBody>
          <ModalFooter pt="0">
            <Center>
              <HStack>
                <Button
                  sx={{
                    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                    _focus: { boxShadow: 'none' },
                  }}
                  colorScheme="blue"
                  onClick={onClose}
                >
                  保存
                </Button>
              </HStack>
            </Center>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormControl>
  );
};
