import React, {useState, useEffect} from 'react';
import { Toggle, Icon, Link, Page, Card, CardHeader, CardFooter, CardContent ,Navbar, Block, BlockTitle, Row} from 'framework7-react';
import axios from 'axios';

export default function Candidates({ f7route }) {
    
    const [syncToAirtable, setSyncToAirtable] = useState(true)
    const [candidates, setCandidates] = useState([])
    const [title, setTitle] = useState("Candidates")

    async function fetchCandidates(collection) {
        const url = `https://eu-central-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/talentdata-wqdfe/service/talentdataWebhook/incoming_webhook/talentdataWebhook?collection=${collection}&syncToAirtable=${syncToAirtable}`
        const result = await axios(url)
        setCandidates(result.data)
    }
    
    useEffect(() => {
        fetchCandidates(f7route.params.collection)
    },[])
    
    useEffect(() => {
        setTitle(f7route.params.collection)
    },[])

    return (
      <Page>
        <Navbar title={title} backLink="Back" />
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
    
    let [stars, setStars] = useState(0)

    useEffect(() => {
        let ranking = props.candidate["Candidate Ranking"]
        console.log("ranking: ", ranking)
        if(ranking > 0 ){
            setStars(ranking)
        }
    },[])
    
    return(
        <Card>
            <CardHeader>
                <p>{firstName} </p>
                <Link>
                    <Icon f7="logo_linkedin"></Icon>
                </Link>
            </CardHeader>
            <CardContent>
                <p>Summary</p>
                <img src={props.candidate["Photo-src"]} width="216px" alt="profile"/>
                <p>Candidate details</p>
            </CardContent>
            <CardFooter className="no-border">
                <Link>Action 1</Link>
                <Link>Action 2</Link>
            </CardFooter>
        </Card>
    )
}

const Stars = (props) => {
    let starsArray = new Array(props.stars)
    return(
        <Row>
            {
                starsArray.map(star => <Block>star</Block>)
            }
        </Row>
    )
}
