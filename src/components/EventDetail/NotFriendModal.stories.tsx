import { Meta } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { NotFriendModal } from './NotFriendModal';

export default {
  component: NotFriendModal,
} as Meta;

export const notFriendModal = () => {
  return (
    <RecoilRoot>
      <NotFriendModal />
    </RecoilRoot>
  );
};
