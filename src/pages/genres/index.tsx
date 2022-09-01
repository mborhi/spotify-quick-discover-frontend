import { Heading, Link } from "@chakra-ui/layout";
import Header from "../../components/Header";
import CollectionDisplay from "../../components/CollectionDisplay";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

const Genres = () => {

    const [genres, setGenres] = useState([]);
    const router = useRouter();

    const getGenres = async () => {
        const response = await fetch('/api/retrieval/genres/', {
            headers: {
                session_id: Cookies.get('session_id')
            }
        });
        const item = await response.json();
        if (item.error !== undefined) {
            Cookies.remove('session_id', { path: '' });
            router.push('/');
        } else {
            const genres = await item.data;
            setGenres(genres);
        }
    }

    useEffect(() => {
        getGenres();
    }, []);

    return (
        <>
            <Header title={"Genres"} />
            <Heading as='h1'><Link href='/' color='teal.700'>Home</Link></Heading>
            <Heading color='teal.500'>Genres</Heading>
            <CollectionDisplay collectionName={"genres"} collection={genres} />
        </>
    )
}

export default Genres;