import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HStack, StackDivider, Heading, Link, Box, Flex, Grid, GridItem, Spacer } from "@chakra-ui/layout";
import { Divider } from '@chakra-ui/react'
import Cookie from 'js-cookie';
import { TrackData } from "../../../interfaces";
import PreviewStackDisplay from "../../components/PreivewStackDisplay";
import WebPlayer from "../../components/WebPlayer";
import setupPlayer from "../../../utils/setup-player";
import Header from '../../components/Header';

const GenreTracks = () => {

    const router = useRouter();
    const [tracks, setTracks] = useState<TrackData[]>([]);
    const [active, setActive] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [player, setPlayer] = useState(false);

    /**
     * Retreives tracks from the given genre, setting the results in tracks
     * @param genre_id the id of the genre
     */
    const getGenreTracks = async (genre_id: string) => {
        const response = await fetch(`/api/retrieval/genres/${genre_id}`, {
            method: 'GET',
            headers: {
                session_id: Cookie.get('session_id')
            }
        });
        const item = await response.json();
        if (item.data === undefined) {
            setTracks([]);
            // TODO: add state for error, which is displayed if playlistTracks is empty
        } else {
            setTracks(item.data);
        }
    }

    const getAccessToken = async () => {
        const response = await fetch('/api/auth/token/', {
            headers: {
                session_id: Cookie.get('session_id')
            }
        });

        const data = await response.json();
        return await data.access_token;
    }

    useEffect(() => {
        // fetch the genre data

        const { genre_id } = router.query
        if (genre_id !== undefined && typeof genre_id === 'string') {
            getGenreTracks(genre_id);
        }

        getAccessToken().then(token => {
            setupPlayer(token);
        });


    }, [router]);

    const playTrack = (track) => {
        setCurrentTrack(track);
        setActive(true);
    }

    return (
        <>
            <Header title={router.query.genre_id as string} />
            <Heading as='h1'><Link href='/' color='teal.700'>Home</Link></Heading>
            <Heading as='h2'><Link href='/genres' color='teal.500'>Genres</Link></Heading>
            {/*<Heading as='h3' color='teal.400'>{(router.query.genre_id as string).toUpperCase()}</Heading>*/}
            {/*<PreviewStackDisplay dataList={tracks} /> */}
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
                            <Box pos='fixed' w={[200, 350, 450]} zIndex={2}>
                                {active ? <WebPlayer track={currentTrack} /> : <h3>no song active...</h3>}
                            </Box>
                        </GridItem>
                    </Grid>
                </Box>
            </Flex>
        </>
    )
}

export default GenreTracks;