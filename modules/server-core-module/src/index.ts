import { Container } from 'typedi';
import ModulesRegistry from './ModulesRegistry';
import GlobalContext from './context/GlobalContext';
import ModuleContext from './context/ModuleContext';
import Context from './context/Context';

export function registerModuleContext(moduleContext: ModuleContext) {
    Container.of(moduleContext.name).set(ModuleContext, moduleContext);
    ModulesRegistry.addModule(moduleContext);
    return moduleContext;
}

export function registerModule(name, color) {
    return registerModuleContext(new ModuleContext(name, color));
}

export {
    ModulesRegistry,
    GlobalContext,
    ModuleContext,
    Context
}