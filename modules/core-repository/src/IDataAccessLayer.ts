import { Entity, Id } from '@modulfy/core-domain';

export default interface IDataAccessLayer<E extends Entity> {

    insert(entity: E): Promise<E>;
    updateById(id: Id, entity: E): Promise<E>;
    findById(id: Id): Promise<E>;
    find(query, size: number, offset: number, sort?): Promise<E[]>;
    count(query): Promise<number>;
    save(entity: E): Promise<E>;
    delete(query): Promise<void>;
    deleteById(id: Id): Promise<void>;

}