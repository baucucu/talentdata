import React, {useState, useEffect} from 'react';
import { f7 } from 'framework7-react';
import { Panel, Button, List, ListItem,ListItemCell,Range, AccordionContent, Toggle, Col, Chip, Icon, Link, Page, Card, CardHeader, CardFooter, CardContent ,Navbar,NavRight, Block, BlockTitle, Row, Segmented} from 'framework7-react';
import mongodb from '../js/mongodb';


export default function Candidates({ f7route }) {
    
    const db = mongodb.db("candidates")
    const coll = db.collection(f7route.query.collection)
    
    const [candidates, setCandidates] = useState([])
    const [statusFilters, setStatusFilters] = useState({
        approved: true,
        pending: true,
        rejected: true
    })
    const [rankingsFilters, setRankingFilters] = useState({
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        NaN: true
    })
    const onRankingRangeChange = (values) => {
        console.log("ranking range changed: ", values)
        let rankings = rankingsFilters
        for(let rank=1; rank<=5;rank++){
            rankings[rank] = rank>=values[0] && rank<=values[1]
        }
        setRankingFilters(rankings)
        fetchCandidates(coll)
      };
    
    function onNaNChange() {
        let rankings = rankingsFilters
        rankings.NaN = !rankings.NaN
        setRankingFilters(rankings)
        fetchCandidates(coll)
    }

    function buildQuery(){
        let filters = Object.keys(statusFilters).filter(x => statusFilters[x])
        let rankings = Object.keys(rankingsFilters).filter(x => rankingsFilters[x]).map(x => Number(x))
        let newQuery = {
            $and: [
                {"Status": {$in: filters}},
                {"Candidate Ranking": {$in: rankings}}
            ]
        }
            // statusFilters.length > 0 && newQuery.$and.push({"Status": {$in: filters}})
        console.log("new query built: ", newQuery )
        return newQuery
    }
    
    
    const fetchCandidates = async (coll) => {
        const records = await coll.find(buildQuery())
        console.log("candidates fetched: ",records.length)
        setCandidates(records.sort((a,b) => b["Candidate Ranking"] - a["Candidate Ranking"]))
        return records
        
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
    
    const updateStatusFilters = (value) => {
        let filters = statusFilters
        filters[value] = !statusFilters[value]
        setStatusFilters(filters)
        fetchCandidates(coll)
    }

    useEffect(()=>{console.log("effect: filters changed")},[statusFilters])
    useEffect(()=>{console.log("effect: rankings changed")},[rankingsFilters])

    useEffect(() => {
        fetchCandidates(coll)
    }, [])

    return (
      <Page id="panel-page">
        <Navbar title={f7route.query.collection.replace("_"," ").toUpperCase()} subtitle={candidates.length + " candidates"}>
            <NavRight>
                <Link color="white" iconF7="scope" iconSize="18px" text="Focus your search" style={{fontSize: "14px"}} panelOpen="#panel-nested">
                    {/* <Icon color="white" f7="scope"/> */}
                </Link>
            </NavRight>
        </Navbar>
        <Panel right cover themeDark containerEl="#panel-page" id="panel-nested">
          <Page>
            {/* <List accordionList>
                
                <ListItem accordionItem active title="Sort">
                    <AccordionContent>
                            <ListItem title="Edit mode" textColor="white" >
                                <Link sortableToggle=".sortable" textColor="white">Toggle</Link>
                            </ListItem>
                        <List sortable>
                            <ListItem title="Candidate Ranking" textColor="yellow" color="yellow">
                                <Icon slot="media" f7="star_fill" size="18px" color="yellow"></Icon>
                            </ListItem>
                            <ListItem title="Candidate Ranking" textColor="yellow" color="yellow">
                                <Icon slot="media" f7="star_fill" size="18px" color="yellow"></Icon>
                            </ListItem>
                            <ListItem title="Candidate Ranking" textColor="yellow" color="yellow">
                                <Icon slot="media" f7="star_fill" size="18px" color="yellow"></Icon>
                            </ListItem>
                        </List>
                    </AccordionContent>
                </ListItem>
            </List> */}
            <BlockTitle className="display-flex justify-content-space-between">
                Candidate Status{' '}
            </BlockTitle>
            <List>
                <ListItem title="Approved" textColor="teal" color="teal">
                    <Icon slot="media" f7="hand_thumbsup_fill" size="18px" color="teal"></Icon>
                    <Toggle onToggleChange={(e)=> {updateStatusFilters("approved"); console.log("approved clicked: ", e)}} slot="after" defaultChecked={statusFilters.approved} ></Toggle>
                </ListItem>
                <ListItem title="Pending" textColor="deeporange" color="deeporange">
                    <Icon slot="media" f7="pause_circle_fill" size="18px" color="deeporange"></Icon>
                    <Toggle onToggleChange={()=> {updateStatusFilters("pending"); console.log("pending clicked")}}  slot="after" defaultChecked={statusFilters.pending}></Toggle>
                </ListItem>
                <ListItem title="Rejected" textColor="pink" color="pink">
                    <Icon  slot="media" f7="hand_thumbsdown_fill" size="18px" color="pink"></Icon>
                    <Toggle onToggleChange={()=> {updateStatusFilters("rejected"); console.log("rejected clicked")}} slot="after" defaultChecked={statusFilters.rejected}></Toggle>
                </ListItem>
                <ListItem title="In progress" textColor="lightblue" color="lightblue">
                    <Icon  slot="media" f7="graph_circle" size="18px" color="lightblue"/>
                    <Toggle onToggleChange={()=> onNaNChange()} slot="after" defaultChecked={rankingsFilters["NaN"]}></Toggle>
                </ListItem>
            </List>
            <BlockTitle className="display-flex justify-content-space-between">
                Candidate Ranking{' '}
                <span>
                {Math.min(...Array.from([1,2,3,4,5]).filter(x => rankingsFilters[x]))} - {Math.max(...Array.from([1,2,3,4,5]).filter(x => rankingsFilters[x]))}
                </span>
            </BlockTitle>
            <List simpleList>
                <ListItem>
                <ListItemCell className="width-auto flex-shrink-0">
                    <Icon
                    f7="star"
                    size="18px"
                    color="yellow"
                    />
                </ListItemCell>
                <ListItemCell className="flex-shrink-3">
                    <Range
                    min={1}
                    max={5}
                    step={1}
                    scale={true}
                    scaleSteps={5}
                    value={[
                        Math.min(...Array.from([1,2,3,4,5]).filter(x => rankingsFilters[x])), 
                        Math.max(...Array.from([1,2,3,4,5]).filter(x => rankingsFilters[x])), 
                    ]}
                    label={true}
                    dual={true}
                    color="yellow"
                    // textColor="black"
                    onRangeChange={onRankingRangeChange}
                    />
                </ListItemCell>
                <ListItemCell className="width-auto flex-shrink-0">
                    <Icon
                    f7="star_fill"
                    size="18px"
                    color="yellow"
                    />
                </ListItemCell>
                </ListItem>
            </List>
          </Page>
        </Panel>
        <Block>
            <Row style={{justifyContent:"space-evenly"}}>
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
        console.log("candidate fetched: ", record)
        setCandidate(record)
    }
    
    useEffect(() => {
        setCandidate(props.candidate)
    },[])

    return(
        <Card className="elevation-10" style={{width: "360px", boxShadow:"10px 10px"}} outline={candidate["Status"] === "pending" ? null : true} borderColor={candidate["Status"] === "" ? null : candidate["Status"] === "approved" ? "teal" : "pink"}>
            <CardHeader>
                <p>{firstName}</p>
                <Link  target="_blank" iconF7="logo_linkedin" color="white" href={`${props.candidate["Public LinkedIn URL"]}`} external/>
            </CardHeader>
            <CardHeader>
                <p>{props.candidate["Current Title"]} @ {props.candidate["Current Employer"]}</p>
            </CardHeader>
            {stars > 0 && <Stars stars={stars}/>}
            {stars > 0 || <CardContent>
                <Chip text="Assessment in progress" mediaBgColor="lightblue" color="lightblue" textColor="black" mediaTextColor="black" iconF7="graph_circle" />
            </CardContent>}
            <CardContent>
                <Col>
                    <img src={props.candidate["Photo-src"]} width="100%" alt="profile"/>
                </Col>
            </CardContent >
            <CardContent>
                <Block>
                    <Chip outline style={{marginRight:"4px", fontSize:"11px"}}>{props.candidate["City"]}</Chip>
                    <Chip outline style={{marginRight:"4px", fontSize:"11px"}}>{props.candidate["Country"]}</Chip>
                </Block>
            </CardContent>
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
                            textColor={candidate["Status"] === "approved" ? "black" : "green"}
                            onClick={() => {updateCandidate(coll, candidate._id, "approved").then(() => {fetchCandidate(candidate._id)}); console.log("approved clicked")}}
                        >
                            <Icon f7="hand_thumbsup_fill" size="14px" style={{marginRight:"8px"}}></Icon>
                            {candidate["Status"] === "approved" ? "Approved" : "Approve"}
                        </Button>
                        <Button 
                            color="deeporange"
                            active={candidate["Status"] === "pending"}
                            textColor={candidate["Status"] === "pending" ? "black" : "deeporange"}
                            onClick={() => {updateCandidate(coll, candidate._id, "pending").then(() => {fetchCandidate(candidate._id)}); console.log("pending clicked")}}
                        >
                            <Icon f7="pause_circle_fill" size="14px" style={{marginRight:"8px"}}></Icon>
                            Pending
                        </Button>
                        <Button  
                            color="pink" 
                            active={candidate["Status"] === "rejected"}
                            textColor={candidate["Status"] === "rejected" ? "black" : "pink"}
                            onClick={() => {updateCandidate(coll, candidate._id, "rejected").then(() => {fetchCandidate(candidate._id)}); console.log("rejected clicked")}}
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
