import { Meta } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { CommentList } from './CommentList';

export default {
  component: CommentList,
} as Meta;

const firsrCommentState = [
  {
    comment: 'コメント1',
    eventId: 'event1',
    userId: 'user1',
    user: {
      id: 'user1',
      name: 'user1',
      profileImg: 'user1',
      createdAt: new Date(2021, 11, 1, 0, 0),
      updatedAt: new Date(2021, 11, 1, 0, 0),
    },
    createdAt: new Date(2021, 11, 1, 0, 0),
    updatedAt: new Date(2021, 11, 1, 0, 0),
  },
  {
    comment: 'コメント2',
    eventId: 'event2',
    userId: 'user2',
    user: {
      id: 'user2',
      name: 'user2',
      profileImg: 'user2',
      createdAt: new Date(2021, 11, 1, 0, 0),
      updatedAt: new Date(2021, 11, 1, 0, 0),
    },
    createdAt: new Date(2021, 11, 1, 0, 0),
    updatedAt: new Date(2021, 11, 2, 0, 0),
  },
  {
    comment: 'コメント3',
    eventId: 'event3',
    userId: 'user3',
    user: {
      id: 'user3',
      name: 'user3',
      profileImg: 'user3',
      createdAt: new Date(2021, 11, 1, 0, 0),
      updatedAt: new Date(2021, 11, 1, 0, 0),
    },
    createdAt: new Date(2021, 11, 1, 0, 0),
    updatedAt: new Date(2021, 11, 3, 0, 0),
  },
];

export const firsrComment = () => {
  return (
    <RecoilRoot>
      <CommentList />
    </RecoilRoot>
  );
};

const lastCommentState = [
  {
    comment: 'コメント2',
    eventId: 'event2',
    userId: 'user2',
    user: {
      id: 'user2',
      name: 'user2',
      profileImg: 'user2',
      createdAt: new Date(2021, 11, 1, 0, 0),
      updatedAt: new Date(2021, 11, 1, 0, 0),
    },
    createdAt: new Date(2021, 11, 1, 0, 0),
    updatedAt: new Date(2021, 11, 2, 0, 0),
  },
  {
    comment: 'コメント3',
    eventId: 'event3',
    userId: 'user3',
    user: {
      id: 'user3',
      name: 'user3',
      profileImg: 'user3',
      createdAt: new Date(2021, 11, 1, 0, 0),
      updatedAt: new Date(2021, 11, 1, 0, 0),
    },
    createdAt: new Date(2021, 11, 1, 0, 0),
    updatedAt: new Date(2021, 11, 3, 0, 0),
  },
  {
    comment: 'コメント1',
    eventId: 'event1',
    userId: 'user1',
    user: {
      id: 'user1',
      name: 'user1',
      profileImg: 'user1',
      createdAt: new Date(2021, 11, 1, 0, 0),
      updatedAt: new Date(2021, 11, 1, 0, 0),
    },
    createdAt: new Date(2021, 11, 1, 0, 0),
    updatedAt: new Date(2021, 11, 1, 0, 0),
  },
];

export const lastComment = () => {
  return (
    <RecoilRoot>
      <CommentList />
    </RecoilRoot>
  );
};

export const noComment = () => {
  return (
    <RecoilRoot>
      <CommentList />
    </RecoilRoot>
  );
};

const oneCommentState = [
  {
    comment: 'コメント1',
    eventId: 'event1',
    userId: 'user1',
    user: {
      id: 'user1',
      name: 'user1',
      profileImg: 'user1',
      createdAt: new Date(2021, 11, 1, 0, 0),
      updatedAt: new Date(2021, 11, 1, 0, 0),
    },
    createdAt: new Date(2021, 11, 1, 0, 0),
    updatedAt: new Date(2021, 11, 1, 0, 0),
  },
];

export const oneComment = () => {
  return (
    <RecoilRoot>
      <CommentList />
    </RecoilRoot>
  );
};
