/**
 * @file react concurrent demo
 * @author Deland
 */

import {Suspense, FC} from 'react';

// Suspense integrations like Relay implement
// a contract like this to integrate with React.
// Real implementations can be significantly more complex.
// Don't copy-paste this into your project!
const wrapPromise = (promise: any) => {
    let status = 'pending';
    let result: any = null;
    const suspender = promise.then(
        (r: any) => {
            status = 'success';
            result = r;
        },
        (e: any) => {
            status = 'error';
            result = e;
        }
    );
    return {
        read() {
            if (status === 'pending') {
                throw suspender;
            } else if (status === 'error') {
                throw result;
            }
            return result;
        },
    };
};

const fetchPosts = () => {
    // eslint-disable-next-line no-console
    console.log('fetch posts...');
    return new Promise(resolve => {
        setTimeout(() => {
            // eslint-disable-next-line no-console
            console.log('fetched posts');
            resolve(
                [
                    {id: 0, text: 'I get by with a little help from my friends'},
                    {id: 1, text: 'I\'d like to be under the sea in an octupus\'s garden'},
                    {id: 2, text: 'You got that sand all over your feet'},
                ]
            );
        }, 2000);
    });
};

const fetchProfileData = () => {
    const postsPromise = fetchPosts();
    return wrapPromise(postsPromise);
};

const resource = fetchProfileData();

const Demo = () => {
    const list = resource.read();

    return (
        <div>
            <h3>Suspense Demo</h3>
            <ul>
                {list.map((item: any) => <li key={item.id}>{item.text}</li>)}
            </ul>
        </div>

    );
};

const ConcurrentDemo: FC = () => {
    return (
        <Suspense fallback={<div>Suspense loading...</div>}>
            <Demo />
        </Suspense>
    );
};

export default ConcurrentDemo;
