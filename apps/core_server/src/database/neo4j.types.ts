import Neode from 'neode';

// Neo4j transaction type from Neode
export type TNeo4jTransaction = ReturnType<ReturnType<Neode['session']>['beginTransaction']>;

// Neo4j query result types
export type TNeo4jResult = Awaited<ReturnType<ReturnType<Neode['session']>['run']>>;
export type TNeo4jRecord = TNeo4jResult['records'][0];

// Neo4j session type
export type TNeo4jSession = ReturnType<Neode['session']>;

