import { Container, Service } from 'typedi';
import { makeExecutableSchema, mergeTypeDefs, mergeResolvers } from 'graphql-tools';
import { ApolloServer, gql } from 'apollo-server-express';
import { EVENT_APOLLO_SERVER_CREATED, ModuleLogger } from '..';
import { Events } from '@jrapp/server-core-events';
import { EVENT_MODULES_LOADED } from '@jrapp/server-core-events';
import { DocumentNode, GraphQLSchema, Source } from 'graphql';

@Service()
export default class GraphQLService {

    private typeDefMap = [];
    private resolverMap = [];
    private server: ApolloServer;

    constructor() {
        this.addTypeDef = this.addTypeDef.bind(this);
        this.addResolver = this.addResolver.bind(this);
        this.onModulesLoaded = this.onModulesLoaded.bind(this);
        Container.get(Events).once(EVENT_MODULES_LOADED, this.onModulesLoaded);
    }

    addTypeDef(typeDef: string | Source | DocumentNode | GraphQLSchema) {
        this.typeDefMap.push(typeDef);
    }

    addResolver(resolver) {
        this.resolverMap.push(resolver);
    }

    private onModulesLoaded() {
        if (this.typeDefMap.length === 0) {
            throw new Error('No typedefs provided for Apollo. Please provide at least 1.');
        }
        const schema = makeExecutableSchema({
            typeDefs: mergeTypeDefs(this.typeDefMap),
            resolvers: this.resolverMap.length > 0 ? mergeResolvers(this.resolverMap) : undefined,
        });
        this.server = new ApolloServer({ schema });
        ModuleLogger.info(`Server started at ${this.server.graphqlPath}`);
        Container.get(Events).emit(EVENT_APOLLO_SERVER_CREATED, this.server);
    }

    getServer(): ApolloServer {
        return this.server;
    }
}
