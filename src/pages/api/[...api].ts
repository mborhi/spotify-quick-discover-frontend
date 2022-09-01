import { NextApiRequest, NextApiResponse } from "next/types";
import http from 'http';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    // send to api gateway
    const options = {
        host: 'api-gateway',
        port: 8080,
        path: req.url,
        method: req.method,
        headers: req.headers
    }

    const proxyReq = http
        .request(options, proxyRes => {
            // set encoding
            proxyRes.setEncoding('utf8');

            // set http status code based on proxied response
            res.writeHead(proxyRes.statusCode);

            // wait for data
            proxyRes.on('data', chunk => {
                res.write(chunk);
            });

            proxyRes.on('close', () => {
                // closed, let's end client request as well
                res.end();
            });

            proxyRes.on('end', () => {
                // finished, let's finish client request as well
                res.end();
            });
        })
        .on('error', e => {
            console.log(e.message);
            try {
                // attempt to set error message and http status
                res.writeHead(500);
                res.write(e.message);
            } catch (e) {
                // ignore
            }
            res.end();
        });
    proxyReq.end();
};

export default handler;