import Context from './Context';
import { Service } from 'typedi';

@Service({global: false})
export default class ModuleContext extends Context {

}