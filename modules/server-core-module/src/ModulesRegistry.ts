import Module from './module/Module';
import { Events } from '@jrapp/server-core-events/dist';
import { Container } from 'typedi';
import { EVENT_MODULE_REGISTERED, EVENT_MODULES_LOADED } from './constants/Events';

class ModulesRegistry {

    registeredModules: Module<any>[] = [];

    addModule(module: Module<any>) {
        this.registeredModules.push(module);
        Container.get(Events).emit(EVENT_MODULE_REGISTERED, ({name: module.name, module}));
        module.logger.info('Module registered.');
    }

    doneLoadingModules() {
        Container.get(Events).emit(EVENT_MODULES_LOADED);
    }

}

export default new ModulesRegistry();