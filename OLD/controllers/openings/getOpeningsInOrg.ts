// import { Request, Response } from 'express';
// import Joi from 'joi';
// import { Filter } from 'mongodb';
// import { IndexableProperties } from '../../@types/indexableProperties';
// import { JOI_SETTINGS } from '../../Config';
// import { OpeningEntity } from '../../@types/entities/application';
// import { collections } from '../../utils/connectToDatabase';
// import { findInRelatedToArray } from '../../utils/findInRelatedToArray';

// const schema = Joi.object({
//   params: {
//     openingId: Joi.string(),
//   },
// }).options(JOI_SETTINGS);

// export const getOpeningsInOrg = async (req: Request, res: Response) => {
//   try {
//     await schema.validateAsync(req);
//   } catch (error) {
//     return res.status(400).json({ message: 'An error ocurred', error });
//   }

//   const { user } = req;
//   const { orgId } = user;
//   let openings: OpeningEntity[] | undefined;

//   const openingsFilter: Filter<OpeningEntity> = {
//     orgId,
//   };
//   try {
//     openings = (await collections.openings.find(openingsFilter).toArray()) as OpeningEntity[];
//     return res.status(200).json(openings);
//   } catch (error) {
//     const message = 'Error ocurred retrieving openings';
//     console.error(message, error);
//     return res.status(500).json({ message });
//   }
// };
