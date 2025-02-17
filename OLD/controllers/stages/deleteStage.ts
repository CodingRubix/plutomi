// import { Request, Response } from 'express';
// import { Filter, UpdateFilter } from 'mongodb';
// import { IndexableProperties } from '../../@types/indexableProperties';
// import { OrgEntity, StageEntity, StageRelatedToArray } from '../../models';
// import { OpeningEntity } from '../../@types/entities/application';
// import { collections, mongoClient } from '../../utils/connectToDatabase';
// import { findInRelatedToArray } from '../../utils/findInRelatedToArray';

// export const deleteStage = async (req: Request, res: Response) => {
//   const { user } = req;
//   const { openingId, stageId } = req.params;
//   const { orgId } = user;

//   console.log(`Incoming opening ID`, openingId);
//   let opening: OpeningEntity;

//   const openingFilter: Filter<OpeningEntity> = {
//     id: openingId,
//     orgId,
//   };
//   try {
//     opening = (await collections.openings.findOne(openingFilter)) as OpeningEntity;
//   } catch (error) {
//     const message = 'An error ocurred finding opening info';
//     console.error(message, error);
//     return res.status(500).json(message);
//   }

//   if (!opening) {
//     return res.status(404).json({
//       message: `Hmm... it appears that the opening with ID of '${openingId}' no longer exists`,
//     });
//   }

//   let ourStage: StageEntity;

//   const stageFilter: Filter<StageEntity> = {
//     id: stageId,
//     $and: [
//       // ! TODO: Replace with elemmatch
//       { relatedTo: { property: IndexableProperties.Opening, value: openingId } },
//       { relatedTo: { property: IndexableProperties.Org, value: orgId } },
//     ],
//   };
//   try {
//     ourStage = (await collections.stages.findOne(stageFilter)) as StageEntity;
//   } catch (error) {
//     const message = 'An error ocurred finding the stage info';
//     console.error(message, error);
//     return res.status(500).json(message);
//   }

//   if (!ourStage) {
//     return res.status(404).json({
//       message: `Hmm... it appears that the stage with ID of '${stageId}' no longer exists`,
//     });
//   }

//   console.log('Getting old previous stage');
//   const oldPreviousStageId = findInRelatedToArray(IndexableProperties.PreviousStage, ourStage);

//   console.log('Getting old next stage');

//   const oldNextStageId = findInRelatedToArray(IndexableProperties.NextStage, ourStage);

//   console.log('Got both');
//   let oldPreviousStage: StageEntity;
//   let oldNextStage: StageEntity;

//   console.log('Starting transaction');
//   const session = mongoClient.startSession();

//   let transactionResults;

//   console.log('Removing the stage!');
//   console.log(stageFilter);
//   try {
//     // TODO these can be done in parallel

//     transactionResults = await session.withTransaction(async () => {
//       // Update the old previous stage, if it existed
//       if (oldPreviousStageId) {
//         const oldPreviousStageFilter: Filter<StageEntity> = {
//           id: oldPreviousStageId,
//           $and: [
//             // ! TODO: Replace with elemmatch
//             { relatedTo: { property: IndexableProperties.Opening, value: openingId } },
//             { relatedTo: { property: IndexableProperties.Org, value: orgId } },
//           ],
//         };

//         oldPreviousStage = (await collections.stages.findOne(oldPreviousStageFilter, {
//           session,
//         })) as StageEntity;

//         const oldPreviousStageNextStageIndex = oldPreviousStage.target.findIndex(
//           (item) => item.property === IndexableProperties.NextStage,
//         );

//         // TODO can these be more efficient? Just updating the specific item in the array

//         oldPreviousStage.target[oldPreviousStageNextStageIndex] = {
//           property: IndexableProperties.NextStage,
//           value: oldNextStageId ? oldNextStageId : null,
//         };

//         console.log('Attempting to update old previous stage');
//         await collections.stages.updateOne(
//           oldPreviousStageFilter,
//           {
//             $set: {
//               relatedTo: oldPreviousStage.target,
//             },
//           },
//           { session },
//         );
//         console.log('Updated old previous stage');
//       }

//       // Update the old next stage, if it existed
//       if (oldNextStageId) {
//         const oldNextStageFilter: Filter<StageEntity> = {
//           id: oldNextStageId,
//           $and: [
//             // ! TODO: Replace with elemmatch
//             { relatedTo: { property: IndexableProperties.Opening, value: openingId } },
//             { relatedTo: { property: IndexableProperties.Org, value: orgId } },
//           ],
//         };

//         oldNextStage = (await collections.stages.findOne(oldNextStageFilter, {
//           session,
//         })) as StageEntity;

//         const oldNextStagePreviousStageIndex = oldNextStage.target.findIndex(
//           (item) => item.property === IndexableProperties.PreviousStage,
//         );

//         oldNextStage.target[oldNextStagePreviousStageIndex] = {
//           property: IndexableProperties.PreviousStage,
//           value: oldPreviousStage ? oldPreviousStageId : undefined,
//         };

//         await collections.stages.updateOne(
//           oldNextStageFilter,
//           {
//             $set: {
//               relatedTo: oldNextStage.target,
//             },
//           },
//           { session },
//         );
//       }

//       // Decrement the totalStages count on the org
//       const orgFilter: Filter<OrgEntity> = {
//         id: orgId,
//       };
//       const orgUpdateFilter: UpdateFilter<OrgEntity> = {
//         $inc: { totalStages: -1 },
//       };
//       await collections.orgs.updateOne(orgFilter, orgUpdateFilter, { session });

//       // Decrement the totalStages count on the opening
//       const openingUpdateFilter: UpdateFilter<OrgEntity> = {
//         $inc: { totalStages: -1 },
//       };
//       await collections.openings.updateOne(openingFilter, openingUpdateFilter, { session });

//       // Remove the stage
//       await collections.stages.deleteOne(stageFilter, { session });

//       await session.commitTransaction();
//     });
//   } catch (error) {
//     const msg = 'Error ocurred deleting that stage';
//     console.error(msg, error);
//     return res.status(500).json({ message: msg });
//   } finally {
//     await session.endSession();
//   }

//   return res.status(200).json({ message: 'Stage deleted!' });
// };
