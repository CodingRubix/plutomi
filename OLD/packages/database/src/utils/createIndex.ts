/* eslint-disable no-console */
import type { AllEntities } from "@plutomi/shared";
import type { Collection, Filter, IndexSpecification } from "mongodb";

type CreateIndexProps = {
  name: string;
  indexSpec: IndexSpecification;
  items: Collection<AllEntities>;
  unique?: boolean;
  sparse?: boolean;
  partialFilterExpression?: Filter<AllEntities>;
};
export const createIndex = async ({
  name,
  indexSpec,
  items,
  unique = false,
  sparse = false,
  partialFilterExpression
}: CreateIndexProps) => {
  try {
    const indexExists = await items.indexExists(name);

    if (!indexExists) {
      try {
        await items.createIndex(indexSpec, {
          name,
          unique,
          sparse,
          partialFilterExpression
        });
      } catch (error) {
        const errorMessage = `An error ocurred creating the ${name} index`;
        console.error(errorMessage, error);
        throw new Error(errorMessage);
      }
    }
  } catch (error) {
    const errorMessage = `An error ocurred checking if the ${name} index exists`;
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
};
