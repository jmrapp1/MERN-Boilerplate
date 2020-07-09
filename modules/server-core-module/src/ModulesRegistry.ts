import ModuleContext from './context/ModuleContext';

class ModulesRegistry {

    registeredModules: ModuleContext[] = [];

    addModule(module: ModuleContext) {
        this.registeredModules.push(module);
        module.logger.info('Module registered.');
    }

}

export default new ModulesRegistry();