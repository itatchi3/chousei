// import "../assets/styles/AttendanceTable.css";
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

type Props = {
  columns: string[];
  attendees: {
    name: string;
    votes: string[];
    comment: string;
  }[];
};

const AttendanceTable = (props: Props) => {
  if (!props.columns) {
    return <></>;
  }
  const attendanceCounts = props.columns.map((column, i) => {
    return {
      date: column,
      positiveCounts: props.attendees.filter((attendee) => attendee.votes[i] === '○').length,
      evenCounts: props.attendees.filter((attendee) => attendee.votes[i] === '△').length,
      negativeCounts: props.attendees.filter((attendee) => attendee.votes[i] === '×').length,
    };
  });

  return (
    <TableContainer className="table" id="attendance-table">
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell size="small">日程</TableCell>
            <TableCell align="center" size="small" padding="none">
              ○
            </TableCell>
            <TableCell align="center" size="small" padding="none">
              △
            </TableCell>
            <TableCell align="center" size="small" padding="none">
              ×
            </TableCell>
            {props.attendees.map((atendee, i) => (
              <TableCell key={i} align="center">
                {atendee.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceCounts.map((count, i) => (
            <TableRow key={i}>
              <TableCell component="th" scope="row">
                {props.columns[i]}
              </TableCell>
              <TableCell align="center" size="small" padding="none">
                {count.positiveCounts}
              </TableCell>
              <TableCell align="center" size="small" padding="none">
                {count.evenCounts}
              </TableCell>
              <TableCell align="center" size="small" padding="none">
                {count.negativeCounts}
              </TableCell>
              {props.attendees.map((atendee, index) => (
                <TableCell key={index} align="center">
                  {atendee.votes[i]}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell component="th" scope="row">
              コメント
            </TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            {props.attendees.map((atendee, i) => (
              <TableCell key={i} align="center">
                {atendee.comment}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceTable;
