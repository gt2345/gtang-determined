import React, { useCallback, useMemo } from 'react';

import Select, { Option, SelectValue } from 'components/kit/Select';
import usersStore from 'stores/users';
import { ALL_VALUE, DetailedUser, User } from 'types';
import { Loadable } from 'utils/loadable';
import { useObservable } from 'utils/observable';
import { getDisplayName } from 'utils/user';

interface Props {
  onChange?: (value: SelectValue) => void;
  value?: SelectValue;
}

const userToSelectOption = (user: User): React.ReactNode => (
  <Option key={user.id} value={user.id}>
    {getDisplayName(user)}
  </Option>
);

const UserSelect: React.FC<Props> = ({ onChange, value }: Props) => {
  const loadableUsers = useObservable(usersStore.getUsers());
  const users: Readonly<DetailedUser[]> = Loadable.match(loadableUsers, {
    Loaded: (usersPagination) => usersPagination.users,
    NotLoaded: () => [],
  }); // TODO: handle loading state
  const loadableCurrentUser = useObservable(usersStore.getCurrentUser());
  const authUser = Loadable.match(loadableCurrentUser, {
    Loaded: (cUser) => cUser,
    NotLoaded: () => undefined,
  });

  const handleSelect = useCallback(
    (newValue: SelectValue) => {
      if (!onChange) return;
      const singleValue = Array.isArray(newValue) ? newValue[0] : newValue;
      onChange(singleValue);
    },
    [onChange],
  );

  const options = useMemo(() => {
    const list: React.ReactNode[] = [
      <Option key={ALL_VALUE} value={ALL_VALUE}>
        All
      </Option>,
    ];

    if (authUser) {
      list.push(
        <Option key={authUser.id} value={authUser.id}>
          {getDisplayName(authUser)}
        </Option>,
      );
    }

    if (users) {
      const allOtherUsers = users
        .filter((user) => !authUser || user.id !== authUser.id)
        .sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b), 'en'))
        .map(userToSelectOption);
      list.push(...allOtherUsers);
    }

    return list;
  }, [authUser, users]);

  return (
    <Select label="Users" value={value || ALL_VALUE} width={200} onSelect={handleSelect}>
      {options}
    </Select>
  );
};

export default UserSelect;
