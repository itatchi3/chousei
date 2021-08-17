import React, { useState } from 'react';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { green, red, blue } from '@material-ui/core/colors';
import { firebaseApp } from 'src/config/firebase';
import { useRecoilValue } from 'recoil';
import { eventState, attendeeState } from 'src/atoms/eventState';
import { useRouter } from 'next/router';

const firebaseDb = firebaseApp.database();

// ボタンの赤色
const redtheme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
});

// ボタンの緑色
const greentheme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
  },
});

// ボタンの青色
const bluetheme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
  },
});

export default function Input() {
  //ボタンの色
  const [color, setColor] = useState('Red');
  //入力ボタンが選択されているかどうか
  const [redVarient, setRedVarient] = useState<'contained' | 'outlined'>('contained');
  const [greenVarient, setGreenVarient] = useState<'contained' | 'outlined'>('outlined');
  const [blueVarient, setBlueVarient] = useState<'contained' | 'outlined'>('outlined');
  // const [scrollCheck, setScrollCheck] = useState(false);

  //解答
  const event = useRecoilValue(eventState);
  const attendee = useRecoilValue(attendeeState);

  const [possibleDates, setPossibleDates] = useState<{ date: string; vote: '○' | '△' | '×' }[]>(
    typeof attendee.votes === undefined
      ? event.prospectiveDates.map((date) => {
          return {
            date: date,
            vote: '△',
          };
        })
      : event.prospectiveDates.map((date, i) => {
          return {
            date: date,
            vote: attendee.votes![i],
          };
        }),
  );

  const router = useRouter();

  // // スクロール関連メソッド
  // //アロー関数だとバグる
  // var scrollControl = function (event) {
  //   event.preventDefault();
  // };

  // // スクロール禁止
  // const noScroll = () => {
  //   setScrollCheck(false);
  //   // スマホでのタッチ操作でのスクロール禁止
  //   document.addEventListener("touchmove", scrollControl, { passive: false });
  //   console.log(scrollCheck);
  // };
  // // スクロール禁止解除
  // const returnScroll = () => {
  //   setScrollCheck(true);
  //   // スマホでのタッチ操作でのスクロール禁止解除
  //   document.removeEventListener("touchmove", scrollControl, {
  //     passive: false,
  //   });
  //   console.log(scrollCheck);
  // };

  const checkColor = (vote: '○' | '△' | '×') => {
    switch (vote) {
      case '○':
        return redtheme;
      case '△':
        return greentheme;
      case '×':
        return bluetheme;
    }
  };

  const onSelectVote = (targetDate: string, selectedVote: '○' | '△' | '×') => {
    const newPossibleDates = possibleDates.map((possibleDate) => {
      return possibleDate.date === targetDate
        ? { ...possibleDate, vote: selectedVote }
        : possibleDate;
    });
    setPossibleDates(newPossibleDates);
  };

  const handleClickRed = () => {
    if (color === 'Red') {
      // setRedVarient("outlined");
      // setGreenVarient("outlined");
      // setBlueVarient("outlined");
      // setColor("");
      // returnScroll();
    } else {
      setRedVarient('contained');
      setGreenVarient('outlined');
      setBlueVarient('outlined');
      setColor('Red');
      // noScroll();
    }
  };

  const handleClickGreen = () => {
    if (color === 'Green') {
      // setRedVarient("outlined");
      // setGreenVarient("outlined");
      // setBlueVarient("outlined");
      // setColor("");
      // returnScroll();
    } else {
      setRedVarient('outlined');
      setGreenVarient('contained');
      setBlueVarient('outlined');
      setColor('Green');
      // noScroll();
    }
  };

  const handleClickBlue = () => {
    if (color === 'Blue') {
      // setRedVarient("outlined");
      // setGreenVarient("outlined");
      // setBlueVarient("outlined");
      // setColor("");
      // returnScroll();
    } else {
      setRedVarient('outlined');
      setGreenVarient('outlined');
      setBlueVarient('contained');
      setColor('Blue');
      // noScroll();
    }
  };

  const handleClickChange = (possibleDate: { date: string }) => {
    switch (color) {
      case 'Red':
        onSelectVote(possibleDate.date, '○');
        break;
      case 'Green':
        onSelectVote(possibleDate.date, '△');
        break;
      case 'Blue':
        onSelectVote(possibleDate.date, '×');
        break;
      default:
      // do nothing
    }
  };

  const registerAttendances = async () => {
    //出欠情報登録機能
    const votes = possibleDates.map((possibleDate) => possibleDate.vote);
    const attendeeData = {
      userId: attendee.userId,
      name: attendee.name,
      votes: votes,
      comment: attendee.comment,
      profileImg: attendee.profileImg,
    };
    // 出欠情報をRealTimeDatabaseに登録
    await firebaseDb
      .ref(`events/${event.eventId}/attendees/${attendeeData.userId}`)
      .set(attendeeData);

    router.push(`/event/${event.eventId}`);
  };

  return (
    // <div className={scrollCheck ? classes.scrollOn : classes.scrollOff}>
    <>
      <Grid
        container
        item
        direction="column"
        justify="center"
        alignItems="center"
        xs={12}
        spacing={4}
      >
        <Grid
          container
          item
          style={{ width: '375px', height: '480px' }}
          // className={classes.scrollOff}
        >
          <StickyTable stickyHeaderCount={1} borderWidth={0} leftStickyColumnCount={0}>
            <Row>
              {event.dates.map((date) => (
                <Cell key={date}>{date}</Cell>
              ))}
            </Row>
            {event.times.map((time, i) => (
              <Row key={time}>
                {event.dates.map((date, j) => (
                  <Cell key={date}>
                    <ThemeProvider
                      theme={checkColor(possibleDates[j * event.times.length + i].vote)}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleClickChange(possibleDates[j * event.times.length + i])}
                        // onTouchEnd={() => console.log("Button touched.")}
                        // onTouchStart={() => console.log("Button touche.")}
                      >
                        {time}
                      </Button>
                    </ThemeProvider>
                  </Cell>
                ))}
              </Row>
            ))}
          </StickyTable>
        </Grid>

        <Grid
          container
          item
          direction="column"
          justify="center"
          alignItems="center"
          xs={12}
          spacing={5}
        ></Grid>
        <Grid
          container
          item
          direction="row"
          justify="center"
          alignItems="center"
          xs={12}
          spacing={5}
        >
          <Grid item xs={4}>
            <ThemeProvider theme={redtheme}>
              <Button variant={redVarient} color="primary" onClick={() => handleClickRed()}>
                ○
              </Button>
            </ThemeProvider>
          </Grid>
          <Grid item xs={4}>
            <ThemeProvider theme={greentheme}>
              <Button variant={greenVarient} color="primary" onClick={() => handleClickGreen()}>
                △
              </Button>
            </ThemeProvider>
          </Grid>
          <Grid item xs={4}>
            <ThemeProvider theme={bluetheme}>
              <Button variant={blueVarient} color="primary" onClick={() => handleClickBlue()}>
                ×
              </Button>
            </ThemeProvider>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={() => registerAttendances()}>
            出欠を回答する
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
