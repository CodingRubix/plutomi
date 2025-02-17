/* eslint-disable no-console */
import {
  MongoClient,
  type Collection,
  type Db,
  ServerApiVersion
} from "mongodb";
import { type AllEntities, IdPrefix } from "@plutomi/shared";
import { createIndex } from "./createIndex";
import { env } from "./env";

const collectionName = "items";

let client: MongoClient;
let items: Collection<AllEntities>;

type ConnectToDatabaseResponse = {
  client: MongoClient;
  items: Collection<AllEntities>;
  database: Db;
};

/**
 * We use a single collection for all entities, and a single index (mostly) for all entities.
 * https://youtu.be/eEENrNKxCdw?t=2721
 * https://mobile.twitter.com/houlihan_rick/status/1482144529008533504
 */

export const connectToDatabase =
  async (): Promise<ConnectToDatabaseResponse> => {
    console.log("Connecting to MongoDB...");
    client = new MongoClient(env.MONGO_URL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      },
      // Remember to update the fargate scaling if needed
      minPoolSize: 10,
      maxPoolSize: 20
    });

    const database: Db = client.db();

    try {
      console.log("Attempting to connect to MongoDB");
      await database.command({ ping: 1 });
      console.info("Successfully connected to database!");
    } catch (error) {
      const errorMessage = "Error connecting to MongoDB!";
      console.error(errorMessage, error);
      throw new Error(errorMessage);
    }

    items = database.collection<AllEntities>(collectionName);

    console.info("Creating necessary collections and indexes...");

    const allCollectionNames = await database.listCollections({}).toArray();
    const collectionExists = allCollectionNames.find(
      (item) => item.name === collectionName
    );

    if (collectionExists === undefined) {
      try {
        console.info("Creating collection", collectionName);
        await database.createCollection(collectionName);
      } catch (error) {
        const errorMessage = `Error creating collection ${collectionName}`;
        console.error(errorMessage, error);
        throw new Error(errorMessage);
      }
    }

    await createIndex({
      // Our main indexed array
      name: "related_to_array",
      indexSpec: {
        "relatedTo.id": 1,
        "relatedTo.type": 1
      },
      items,
      partialFilterExpression: { related_to: { $exists: true } }
    });

    await createIndex({
      // Workspaces are globally unique
      name: "unique_workspace_id",
      indexSpec: {
        // Order doesn't *really* matter here
        _type: 1,
        custom_workspace_id: 1
      },
      unique: true,
      items,
      partialFilterExpression: {
        $and: [
          {
            custom_workspace_id: { $exists: true }
          },
          {
            _type: IdPrefix.WORKSPACE
          }
        ]
      }
    });

    await createIndex({
      // User emails are globally unique
      name: "unique_user_email",
      indexSpec: {
        // Order doesn't *really* matter here
        _type: 1,
        email: 1
      },
      unique: true,
      items,
      partialFilterExpression: {
        $and: [
          {
            email: { $exists: true }
          },
          {
            _type: IdPrefix.USER
          }
        ]
      }
    });

    await createIndex({
      // Waitlist emails are globally unique
      name: "unique_waitlist_email",
      indexSpec: {
        // Order doesn't *really* matter here
        _type: 1,
        email: 1
      },
      unique: true,
      items,
      partialFilterExpression: {
        $and: [
          {
            email: { $exists: true }
          },
          {
            _type: IdPrefix.WAIT_LIST_USER
          }
        ]
      }
    });

    await createIndex({
      // Ensure a user has one default workspace / membership
      name: "one_default_workspace",
      indexSpec: {
        // Order doesn't *really* matter here
        _type: 1,
        user: 1,
        is_default: 1
      },
      unique: true,
      items,
      partialFilterExpression: {
        $and: [
          {
            user: { $exists: true }
          },
          {
            _type: IdPrefix.MEMBERSHIP
          },
          {
            is_default: { $eq: true }
          }
        ]
      }
    });

    console.log("Done.");
    return { client, items, database };
  };
