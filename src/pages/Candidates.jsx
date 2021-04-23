import React, {useState, useEffect} from 'react';
// import { f7ready } from 'framework7-react';
import { Button, List, ListItem, AccordionContent, Toggle, Col, Chip, Icon, Link, Page, Card, CardHeader, CardFooter, CardContent ,Navbar, Block, BlockTitle, Row, Segmented} from 'framework7-react';
import mongodb from '../js/mongodb';

export default function Candidates({ f7route }) {
    
    const [syncToAirtable, setSyncToAirtable] = useState(true)
    const [candidates, setCandidates] = useState([])
    
    const db = mongodb.db("candidates")
    const coll = db.collection(f7route.query.collection)
    
    const fetchCandidates = async (coll) => {
        const records = await coll.find()
        setCandidates(records)
    }

    const fetchCandidate = async (coll) => {
        const record = await coll.findOne()
        console.log(record)
    }

    const updateCandidate = async (coll, _id, status) => {
        const query = {"_id": _id};
        const update = {
            "$set": {
                "Status" : status
            }
        };
        const options = { "upsert": false };
        const result = await coll.updateOne(query, update)
        fetchCandidates(coll)
        console.log("status updated: ",status)
        return result
    }
    
    useEffect(() =>{
        fetchCandidates(coll)
        fetchCandidate(coll)
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
                        <CandidateCard 
                            key={candidate["Public LinkedIn URL"]} 
                            candidate={candidate}
                            fetchCandidates={fetchCandidates}
                            updateCandidate={updateCandidate}
                            coll={coll}
                        />
                    )
                })}
            </Row>
        </Block>
      </Page>
    );
}

const CandidateCard = (props) => {

    const [candidate, setCandidate] = useState(props.candidate)

    const {updateCandidate, fetchCandidates, coll} = props
    const firstName = props.candidate["Name"].split(" ")[0]
    
    const stars = props.candidate["Candidate Ranking"]
    
    const fetchCandidate = async _id => {
        const record = await coll.findOne({"_id": _id})
        console.log("candidate fetched", record)
        setCandidate(record)
    }

    useEffect(() => {
        setCandidate(props.candidate)
    },[])

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
            {props.candidate["Language 1"] !== "null" && <CardContent >
                <Block>
                    <Chip style={{marginRight:"4px", fontSize:"11px"}}>{props.candidate["Language 1"]}</Chip>
                    {props.candidate["Language 2"] !== "null" && <Chip style={{marginRight:"4px", fontSize:"11px"}}>{props.candidate["Language 2"]}</Chip>}
                    {props.candidate["Language 3"] !== "null" && <Chip style={{marginRight:"4px", fontSize:"11px"}}>{props.candidate["Language 3"]}</Chip>}
                    {props.candidate["Language 4"] !== "null" && <Chip style={{marginRight:"4px", fontSize:"11px"}}>{props.candidate["Language 4"]}</Chip>}
                </Block>
            </CardContent>}
            <CardContent>
                <Block>
                    {props.candidate["Standardised position"] && <Chip outline style={{marginRight:"4px", fontSize:"11px"}}>{props.candidate["Standardised position"]}</Chip>}
                    <Chip outline style={{marginRight:"4px", fontSize:"11px"}}>{props.candidate.industry}</Chip>
                    {props.candidate?.["Functional recruitment area"] && <Chip outline style={{marginRight:"4px", fontSize:"11px"}}>{props.candidate["Functional recruitment area"]}</Chip>}

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
            <CardContent>
                <List accordionList>
                    <ListItem accordionItem title="Experience">
                        <AccordionContent>
                            <List mediaList>
                                <ListItem 
                                    title={props.candidate["Current Employer"]}
                                    text={props.candidate["Current Title"]} 
                                    after= {props.candidate["Tenure"]} 
                                >
                                </ListItem>
                                <ListItem 
                                    title={props.candidate["Previous employer 2"]}
                                    text={props.candidate["Previous Title 2"]} 
                                    after={props.candidate["2nd company length in role" ]} 
                                >
                                </ListItem>
                                <ListItem  
                                    title={props.candidate["Previous employer 3"]}
                                    text={props.candidate["Previous Title 3"]} 
                                    after={props.candidate["3rd Company length in role" ]} 
                                >
                                </ListItem>
                                <ListItem  
                                    title={props.candidate["4th Company"]}
                                    text={props.candidate["4th Position"]} 
                                    after={props.candidate["4th Company Length in role" ]}   
                                >
                                </ListItem>
                            </List>
                        </AccordionContent>
                    </ListItem>
                </List>
            </CardContent>
            {props.candidate["Top University Attended"] !== "null" && <CardContent>
                <List accordionList>
                    <ListItem accordionItem title="Education">
                        <AccordionContent>
                            <List mediaList>
                                <ListItem 
                                    title={props.candidate["Top University Attended"]}
                                    text={props.candidate["Top Degree obtained"]} 
                                    after= {props.candidate["Top Degree Dates attended"]} 
                                >
                                </ListItem>
                                {props.candidate["2nd University Attended"] !== "null" && <ListItem 
                                    title={props.candidate["2nd University Attended"]}
                                    text={props.candidate["2nd Degree obtained"]} 
                                    after= {props.candidate["2nd University Dates Attended"]} 
                                ></ListItem>}
                                {props.candidate["3rd University Attended"] !== "null" && <ListItem 
                                    title={props.candidate["3rd University Attended"]}
                                    text={props.candidate["3rd Degree Obtained"]} 
                                    after= {props.candidate["3rd Degree Dates Attended"]} 
                                ></ListItem>}
                            </List>
                        </AccordionContent>
                    </ListItem>
                </List>
            </CardContent>}
            <CardFooter className="no-border" style={{marginTop:"20px"}}>
                    <Segmented  raised tag="p" style={{width:"100%"}}>
                        <Button 
                            color="green" 
                            active={candidate["Status"] === "approved"}
                            onClick={() => {updateCandidate(coll, candidate._id, "approved").then(result => {fetchCandidate(candidate._id)}); console.log("approved clicked")}}
                        >
                            <Icon f7="hand_thumbsup_fill" size="14px" style={{marginRight:"8px"}}></Icon>
                            {candidate["Status"] === "approved" ? "Approved" : "Approve"}
                        </Button>
                        <Button 
                            color="deeporange" 
                            active={candidate["Status"] === ""}
                            onClick={() => {updateCandidate(coll, candidate._id, "").then(result => {fetchCandidate(candidate._id)}); console.log("pending clicked")}}
                        >
                            <Icon f7="pause_circle_fill" size="14px" style={{marginRight:"8px"}}></Icon>
                            Pending
                        </Button>
                        <Button  
                            color="red" 
                            active={candidate["Status"] === "rejected"}
                            onClick={() => {updateCandidate(coll, candidate._id, "rejected").then(result => {fetchCandidate(candidate._id)}); console.log("rejected clicked")}}
                        >
                            <Icon f7="hand_thumbsdown_fill" size="14px" style={{marginRight:"8px"}}></Icon>
                            {candidate["Status"] === "rejected" ? "Rejected" : "Reject"}
                        </Button>
                    </Segmented>
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
