import { useEffect } from "react";
import { useRouter } from 'next/router';

const LoginPage = () => {

    const router = useRouter();

    useEffect(() => {
        const { success } = router.query;
        if (success === "true") {
            router.push('/');
        }
    }, [router]);

    return (
        <p>Logging in...</p>
    )
};

export default LoginPage;
