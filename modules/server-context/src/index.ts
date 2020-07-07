import Context from './Context';
import { Container } from 'typedi';
import { Events, INITIALIZED } from '@jrapp/server-events';
import { Logger } from '@jrapp/server-logging';

Container.get(Events).once(INITIALIZED, () => {
    Logger.info('[Server-Context] Module Initialized.');
});

export {
    Context
}