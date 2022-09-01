import { useEffect, useState } from "react";
import CollectionDisplay from "../../components/CollectionDisplay";
import Header from "../../components/Header";
import WebPlayer from "../../components/WebPlayer";
import { HStack, StackDivider, Heading, Link, Box, Flex, Grid, GridItem, Spacer } from "@chakra-ui/layout";
import PreviewStackDisplay from "../../components/PreivewStackDisplay";
import { useRouter } from "next/router";
import Cookie from 'js-cookie';
import setupPlayer from "../../../utils/setup-player";
import { Button } from "@chakra-ui/react";

const Playlist = () => {

    const [tracks, setTracks] = useState([]);
    const [active, setActive] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const router = useRouter();

    const fetchTracks = async () => {
        const response = await fetch('/api/retrieval/playlist/', {
            headers: {
                session_id: Cookie.get('session_id')
            }
        });
        const jsonRes = await response.json();
        const tracks = await jsonRes.data;
        setTracks(tracks);
    }

    const getAccessToken = async () => {
        const response = await fetch('/api/auth/token/', {
            method: "GET",
            headers: {
                session_id: Cookie.get('session_id')
            }
        });
        const data = await response.json();
        return await data.access_token;
    }


    const playTrack = (track) => {
        setCurrentTrack(track);
        setActive(true);
    }

    useEffect(() => {
        fetchTracks();
        getAccessToken().then(token => {
            setupPlayer(token);
        });
    }, [router]);

    return (
        <>
            <Header title={"My Finds"} />
            <Heading as='h1'><Link href='/' color='teal.700'>Home</Link></Heading>
            <Heading as='h2' color='teal.500'>My Finds</Heading>
            <Flex align='vertical-align' pos='relative' gap='2' marginTop="25px" marginBottom="50px">
                <Box flex='4' pos='relative'>
                    {/*previewPlayback*/}
                    <PreviewStackDisplay dataList={tracks} changeTrack={playTrack} />
                </Box>
                <Spacer />
                <Box flex='6' pos='relative' overflow='wrap'>
                    <Grid templateRows='repeat(2, 1fr)'>
                        <GridItem pos='relative'><Heading as='h3' size='lg'>Player</Heading></GridItem>
                        <GridItem>
                            <Box pos='fixed' w={[100, 300, 450]} zIndex={2}>
                                {active ? <WebPlayer track={currentTrack} reload={() => fetchTracks()} /> : <h3>no song active...</h3>}
                            </Box>
                        </GridItem>
                    </Grid>
                </Box>
            </Flex>
        </>

    )

}

export default Playlist;