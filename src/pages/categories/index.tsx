import { Heading, Link } from "@chakra-ui/layout"
import { useEffect, useState } from "react";
import { useRouter, withRouter } from "next/router";
import CollectionDisplay from "../../components/CollectionDisplay";
import Cookies from 'js-cookie';
import { parseCookies } from "../../../utils/parseCookies";


const Categories = ({ initialLoggedIn = true, router }) => {

    const [categories, setCategories] = useState([]);
    const [loggedIn, setLoggedIn] = useState(() => initialLoggedIn);

    const getCategories = async () => {
        const response = await fetch('/api/retrieval/categories/', {
            method: "GET",
            headers: {
                session_id: Cookies.get('session_id')
            }
        });
        const item = await response.json();
        if (item.error !== undefined) {
            Cookies.remove('session_id', { path: '' });
            router.push('/');
        } else {
            const categories = await item.data;
            setCategories(categories);
        }
    }

    useEffect(() => {
        if (!loggedIn) {
            router.push('/');
        } else {
            getCategories();
        }
    }, []);

    return (
        <>
            <Heading as='h1'><Link href='/' color='teal.700'>Home</Link></Heading>
            <Heading color='teal.500'>Categories</Heading>
            <CollectionDisplay collectionName={"categories"} collection={categories} />
        </>
    )
}

Categories.getInitialProps = ({ req }) => {
    const cookies = parseCookies(req);

    return {
        initialLoggedIn: cookies.session_id
    }

}

export default withRouter(Categories)
