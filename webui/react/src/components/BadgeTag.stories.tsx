import { select, text, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import { enumToOptions } from 'storybook/utils';
import { CommandState } from 'types';

import BadgeTag, { BadgeType } from './BadgeTag';

export default {
  component: BadgeTag,
  decorators: [ withKnobs ],
  title: 'BadgeTag',
};

const knobTypeOptions = enumToOptions<BadgeType>(BadgeType);

export const Default = (): React.ReactNode => <BadgeTag tag="Special ID">a4fdb98</BadgeTag>;

export const Custom = (): React.ReactNode => (
  <BadgeTag
    tag={text('Tag', 'Tag')}
    preTag={text('Pre Tag', '')}
    state={select('State', CommandState, CommandState.Assigned)}
    type={select<BadgeType>('Type', knobTypeOptions, BadgeType.Default)}>
    {text('Content', 'a4fdb98')}
  </BadgeTag>
);
