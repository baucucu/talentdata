import React, {useState, useEffect} from 'react';
import { Button, List, ListItem, AccordionContent, Toggle, Col, Chip, Icon, Link, Page, Card, CardHeader, CardFooter, CardContent ,Navbar, Block, BlockTitle, Row, Segmented} from 'framework7-react';
import mongodb from '../js/mongodb';

export default function Candidates({ f7route }) {
    
    const [syncToAirtable, setSyncToAirtable] = useState(true)
    const [candidates, setCandidates] = useState([])
    
    const db = mongodb.db("candidates")
    const coll = db.collection(f7route.query.collection)
    
    useEffect(async () => {
        const records = await coll.find()
        setCandidates(records)
    },[])

    return (
      <Page>
        <BlockTitle>
            <b># Candidates: </b>{candidates.length}
        </BlockTitle>
        
        <Block>
            <Row>
                {candidates.map(candidate => {
                    return(
                        <CandidateCard key={candidate["Public LinkedIn URL"]} candidate={candidate}/>
                    )
                })}
            </Row>
        </Block>
      </Page>
    );
}

const CandidateCard = (props) => {
    const firstName = props.candidate["Name"].split(" ")[0]
    
    const stars = props.candidate["Candidate Ranking"] //[Object.keys(props.candidate["Candidate Ranking"])[0]]
    // console.log(props.candidate)
    
    return(
        <Card style={{width: "360px"}}>
            <CardHeader >
                <p>{firstName} ({props.candidate["City"]}, {props.candidate["Country"]})  </p>
                <Link  target="_blank" iconF7="logo_linkedin" color="white" href={`${props.candidate["Public LinkedIn URL"]}`} external/>
            </CardHeader>
            {stars > 0 && <Stars stars={stars}/>}
            {stars > 0 || <CardContent>
                <Chip text="Unassessed" mediaBgColor="yellow" mediaTextColor="black" media="U" />
            </CardContent>}
            <CardContent>
                <Col>
                    <img src={props.candidate["Photo-src"]} width="100%" alt="profile"/>
                </Col>
            </CardContent >
            <CardContent >
                <Block>
                    {props.candidate["Language 1"] !== "null" && <Chip>{props.candidate["Language 1"]}</Chip>}
                    {props.candidate["Language 2"] !== "null" && <Chip>{props.candidate["Language 2"]}</Chip>}
                    {props.candidate["Language 3"] !== "null" && <Chip>{props.candidate["Language 3"]}</Chip>}
                    {props.candidate["Language 4"] !== "null" && <Chip>{props.candidate["Language 4"]}</Chip>}
                </Block>
            </CardContent>
            {props.candidate["Summary"] !== "" && <CardContent width="300px">
                    <List accordionList>
                        <ListItem accordionItem title="Summary">
                            <AccordionContent>
                            <Block>
                                {props.candidate["Summary"]}
                            </Block>
                            </AccordionContent>
                        </ListItem>
                    </List>
            </CardContent>}
            <CardFooter className="no-border" style={{marginTop:"20px"}}>
                <Col>
                    <Segmented  raised tag="p">
                        <Button   color="green">
                            Approved
                        </Button>
                        <Button  active color="blue">
                            Pending
                        </Button>
                        <Button  color="red">
                            Rejected
                        </Button>
                    </Segmented>
                </Col>
            </CardFooter>
        </Card>
    )
}

const Stars = (props) => {
    return(
        <CardContent>
            <Icon f7={0 < props.stars ? "star_fill": "star"} color="yellow" size="16"></Icon>
            <Icon f7={1<props.stars ? "star_fill": "star"} color="yellow" size="16"></Icon>
            <Icon f7={2<props.stars ? "star_fill": "star"} color="yellow" size="16"></Icon>
            <Icon f7={3<props.stars ? "star_fill": "star"} color="yellow" size="16"></Icon>
            <Icon f7={4<props.stars ? "star_fill": "star"} color="yellow" size="16"></Icon>
        </CardContent>
    )
}
