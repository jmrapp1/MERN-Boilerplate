import { Service } from 'typedi';
import ModuleContext from './context/ModuleContext';

@Service()
export default class ModulesRegistry {

    registeredModules: ModuleContext[] = [];

    addModule(module: ModuleContext) {
        this.registeredModules.push(module);
        module.logger.info('Module registered and active. Total: ' + this.registeredModules.length);
    }

    getModules() {
        return this.registeredModules;
    }

}