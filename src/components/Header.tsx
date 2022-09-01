import { Link, Heading } from "@chakra-ui/layout";
import Head from "next/head";

interface Props {
    title: string
}

const Header = ({ title }: Props) => {

    return (

        <>
            <Head>
                <title>{title}</title>
                {/*<link rel="icon" href="/images/siteicon.svg" />*/}
                <meta charSet="UTF-8"></meta>
            </Head>
        </>
    )
}

export default Header;