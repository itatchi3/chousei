import { useState, useEffect } from 'react';
import { firebaseApp } from 'src/config/firebase';
import { DateObject } from 'react-multi-date-picker';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useAuth } from 'src/hooks/auth';
import { useRecoilValue } from 'recoil';
import { editingEventState } from 'src/atoms/eventState';

export const EventPush = () => {
  const firebaseDb = firebaseApp.database();
  const event = useRecoilValue(editingEventState);
  const { liff } = useAuth();
  const [eventNameValidation, setEventNameValidation] = useState(true);
  const [datesValidation, setDatesValidation] = useState(true);

  const registerEvent = async () => {
    if (event.eventName !== '' && event.dates !== null) {
      //入力した値の整形
      const possibleDates = (event.dates as DateObject[]).map(
        (date) => date.month + '/' + date.day,
      );

      const sortedPossibleDates = possibleDates.sort((a, b) => {
        return a > b ? 1 : -1;
      });

      const times = [];
      switch (event.timeInterval[0]) {
        case 15:
          for (let i = event.timeWidth[0]; i < event.timeWidth[1]; i++) {
            times.push(i + ':00');
            times.push(i + ':15');
            times.push(i + ':45');
          }
          break;
        case 30:
          for (let i = event.timeWidth[0]; i < event.timeWidth[1]; i++) {
            times.push(i + ':00');
            times.push(i + ':30');
          }
          break;
        case 60:
          for (let i = event.timeWidth[0]; i < event.timeWidth[1]; i++) {
            times.push(i + ':00');
          }
          break;
        case 120:
          for (let i = event.timeWidth[0]; i < event.timeWidth[1]; i = i + 2) {
            times.push(i + ':00');
          }
          break;

        default:
        // do nothing
      }
      const prospectiveDates = [];
      for (let j = 0; j < sortedPossibleDates.length; j++) {
        for (let k = 0; k < times.length; k++) {
          prospectiveDates.push(sortedPossibleDates[j] + '  ' + times[k]);
        }
      }

      const eventData = {
        name: event.eventName,
        description: event.description,
        dates: sortedPossibleDates,
        times: times,
        prospectiveDates: prospectiveDates,
      };
      //Realtime Databaseに整形した値を書き込む
      //LINEに出欠表のURLを送信する

      const eventPush = await firebaseDb.ref('events').push(eventData);
      const eventId = eventPush.key;
      await liff!
        .sendMessages([
          {
            type: 'text',
            text: '出欠表が完成したよ！',
          },
          {
            type: 'text',
            text:
              '【イベント名】\n' +
              event.eventName +
              '\n' +
              '【概要】\n' +
              event.description +
              '\n' +
              'https://liff.line.me/1656098585-v7VEeZ7Q/event/' +
              eventId,
          },
        ])
        .then(() => {
          console.log('message sent');
        })
        .catch((err) => {
          console.log('error', err);
          alert(err);
        });
      // liffアプリを閉じる
      liff!.closeWindow();
      // router.push(`/event/${eventId}`);
    }
  };

  useEffect(() => {
    const errorCheck = () => {
      if (event.eventName === '') {
        setEventNameValidation(false);
      } else {
        setEventNameValidation(true);
      }

      // 無理矢理感ある
      if ((event.dates as DateObject[]).length === 0) {
        setDatesValidation(false);
      } else {
        setDatesValidation(true);
      }
    };
    errorCheck();
  }, [event.eventName, event.dates]);
  return (
    <Grid container item xs={12} justify="flex-end" className="button-area">
      <Grid container item justify="flex-end">
        {eventNameValidation === false ? (
          <p>イベント名を入力してください</p>
        ) : (
          <p>
            <br />
          </p>
        )}
        {datesValidation === false ? (
          <p>候補日を入力してください</p>
        ) : (
          <p>
            <br />
          </p>
        )}
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            registerEvent();
          }}
        >
          イベントを作る
        </Button>
      </Grid>
    </Grid>
  );
};
