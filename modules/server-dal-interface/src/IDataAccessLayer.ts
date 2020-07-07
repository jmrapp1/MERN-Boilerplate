
export default interface IDataAccessLayer {

    insert(model);
    save(model);
    updateById(id: string, updates);
    delete(query);
    deleteById(id: string);
    findById(id: string);
    find(query, size: number, offset: number, sort?);
    count(query);

}