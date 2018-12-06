// @flow
import React, { Fragment } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToApp from '@material-ui/icons/';
import PeopleIcon from '@material-ui/icons/People';
import SvgIcon from '@material-ui/core/SvgIcon';

type Props = {
  onClick: func,
};

const ListItems = ({ onClick }: Props) => (
  <Fragment>
    <ListItem
      button
      style={{ width: 'auto' }}
      onClick={() => onClick('Dashboard')}
    >
      <ListItemIcon>
        <SvgIcon style={{ color: 'white' }}>
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
        </SvgIcon>
      </ListItemIcon>
      <ListItemText
        primaryTypographyProps={{ variant: 'inherit' }}
        primary="Dashboard"
      />
    </ListItem>
    <ListItem
      button
      style={{ width: 'auto' }}
      onClick={() => onClick('Account')}
    >
      <ListItemIcon>
        <PeopleIcon style={{ color: 'white' }} />
      </ListItemIcon>
      <ListItemText
        primaryTypographyProps={{ variant: 'inherit' }}
        primary="Account information"
      />
    </ListItem>
    <ListItem
      button
      style={{ width: 'auto' }}
      onClick={() => onClick('Logout')}
    >
      <ListItemIcon>
        <SvgIcon style={{ color: 'white' }}>
          <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
        </SvgIcon>
      </ListItemIcon>
      <ListItemText
        primaryTypographyProps={{ variant: 'inherit' }}
        primary="Logout"
      />
    </ListItem>
  </Fragment>
);

export default ListItems;
