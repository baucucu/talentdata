import React from 'react';
import {
    Page,
    BlockTitle,
    List,
    ListItem,
} from 'framework7-react';

export default function Home({ f7route }) {
  return(
  <Page>
    <BlockTitle>Projects</BlockTitle>
    <List>
      <ListItem link="/candidates?collection=adobe_recruiter&syncToAirtable=true" title="Adobe Recruiter"></ListItem>
      <ListItem link="/candidates?collection=garrett_it&syncToAirtable=true" title="Garrett IT Director"></ListItem>
      <ListItem link="/candidates?collection=garrett_hr&syncToAirtable=true" title="Garrett HR"></ListItem>
      <ListItem link="/candidates?collection=garrett_hse&syncToAirtable=true" title="Garrett HSE"></ListItem>
    </List>
    
  </Page>
  )
};
