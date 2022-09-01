import { Button } from "@chakra-ui/button";
import { Heading, Box } from "@chakra-ui/layout";
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/slider";
import { Text, Image } from '@chakra-ui/react';
import { TrackData } from "../../interfaces";
import { useState } from "react";
import Cookie from 'js-cookie';
import { stringify } from "querystring";

interface Props {
    track: TrackData
    reload?: () => void
}

const WebPlayer = ({ track, reload }: Props) => {

    const [paused, setPaused] = useState(true);

    const togglePlayback = async () => {
        const device_id = Cookie.get('device_id');
        if (!paused) {
            const response = await fetch(`http://localhost:3000/api/playback/pause?device_id=${device_id}`, {
                method: 'PUT',
                headers: {
                    session_id: Cookie.get('session_id')
                }
            });
            const data = await response.json();
            setPaused(true);
        } else {
            const queryParams = {
                device_id: device_id,
                track_uri: track.trackURI,
                track_num: track.trackNum,
            }
            const response = await fetch('http://localhost:3000/api/playback/play?' + stringify(queryParams), {
                method: 'PUT',
                headers: {
                    session_id: Cookie.get('session_id')
                }
            });
            const data = await response.json();
            setPaused(false);
        }
    }

    const handleVolume = async (volume: number) => {
        const device_id = Cookie.get('device_id');
        const queryParams = {
            device_id: device_id,
            volume: volume
        }
        const response = await fetch('http://localhost:3000/api/playback/volume?' + stringify(queryParams), {
            method: 'PUT',
            headers: {
                session_id: Cookie.get('session_id')
            }
        });
        const data = await response.json();
    }

    const addToPlaylist = async () => {
        const trackToAdd = {
            track_uri: track.trackURI
        }
        // TODO: change all client side api calls to this format
        const url = '/api/retrieval/playlist/tracks?' + stringify(trackToAdd);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                session_id: Cookie.get('session_id')
            }
        });
        const data = await response.json();
    }

    const removeFromPlaylist = async () => {
        const trackToRemove = {
            track_uri: track.trackURI
        }
        const url = '/api/retrieval/playlist/tracks?' + stringify(trackToRemove);
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                session_id: Cookie.get('session_id')
            }
        });
        const data = await response.json();
        if (data.error === undefined) {
            reload();
        }
    }

    return (
        <>
            <div>
                <Heading as='h4' size='lg' color='green.600'>{track.name}</Heading>
                <Image src={track.trackAlbumImage} />
            </div>
            <Box m="5px">
                <Button colorScheme='green' size='sm' variant='solid' onClick={() => togglePlayback()}>{paused ? "PLAY" : "PAUSE"}</Button>
                <Text>🔊 Sound</Text>
                <Slider defaultValue={40} min={0} max={100} step={10} onChange={(volume) => handleVolume(volume)}>
                    <SliderTrack bg='green.100'>
                        <Box position='relative' right={10} />
                        <SliderFilledTrack bg='green.400' />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                </Slider>
                {<Button onClick={() => addToPlaylist()}>{"Add"}</Button>}
                <Button onClick={() => removeFromPlaylist()}>Remove</Button>
            </Box>
        </>
    )
}

export default WebPlayer;