import React from 'react';
import {
    Page,
    BlockTitle,
    List,
    ListItem,
} from 'framework7-react';

export default () => (
  <Page>
    <BlockTitle>Projects</BlockTitle>
    <List>
      <ListItem link="/candidates/adobe_recruiter?syncToAirtable=true" title="Adobe Recruiter"></ListItem>
      <ListItem link="/candidates/garrett_it?syncToAirtable=true" title="Garrett IT Director"></ListItem>
      <ListItem link="/candidates/garrett_hr?syncToAirtable=true" title="Garrett HR"></ListItem>
      <ListItem link="/candidates/garrett_hse?syncToAirtable=true" title="Garrett HSE"></ListItem>
    </List>
    
  </Page>
);
