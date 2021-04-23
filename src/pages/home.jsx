import React, {useState, useEffect} from 'react';
import mongodb from '../js/mongodb'
import {
    Page,
    BlockTitle,
    List,
    ListItem,
} from 'framework7-react';


export default function Home({ f7route, f7router }) {
  
  console.log("query: ",f7route.query.collection)
  
  let [collection, setCollection] = useState()

  useEffect(() => {
    if(f7route.query?.collection){
      
      setCollection(f7route.query.collection)
    } else {
      console.log("no query")
    }
  },[])

  useEffect(() => {
    if(collection) {f7router.navigate(`/candidates?collection=${collection}&syncToAirtable=true`)}
  },[collection])

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
