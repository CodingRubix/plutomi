// import { Request, Response } from 'express';
// import Joi from 'joi';
// import { Defaults, JOI_SETTINGS } from '../../Config';
// // export interface APIUpdateUserOptions extends Partial<Pick<DynamoUser, 'firstName' | 'lastName'>> {}

// const schema = Joi.object({
//   firstName: Joi.string().min(1), // TODO set max length
//   lastName: Joi.string().min(1), // TODO set max length
// }).options(JOI_SETTINGS);

// export const updateUser = async (req: Request, res: Response) => {
//   try {
//     await schema.validateAsync(req.body);
//   } catch (error) {
//     return res.status(400).json({ message: 'An error ocurred', error });
//   }
//   return res.status(200).json({ message: 'TODO Endpoint temporarily disabled!' });

//   // let updatedValues: APIUpdateUserOptions = {};
//   // const { user } = req;

//   // // TODO RBAC will go here, right now you can only update yourself
//   // if (req.params.userId !== user.userId) {
//   //   return res.status(403).json({ message: 'You cannot update this user' });
//   // }

//   // if (req.body.firstName) {
//   //   updatedValues.firstName = req.body.firstName;
//   // }

//   // if (req.body.lastName) {
//   //   updatedValues = req.body.lastName;
//   // }

//   // const [updatedUser, error] = await DB.Users.updateUser({
//   //   userId: user.userId,
//   //   updatedValues,
//   // });

//   // if (error) {
//   //   const { status, body } = CreateError.SDK(error, 'An error ocurred updating user info');
//   //   return res.status(status).json(body);
//   // }

//   // return res.status(200).json({
//   //   // TODO RBAC is not implemented yet so this won't trigger
//   //   message: req.params.userId === user.userId ? 'Info updated!' : 'User updated!',
//   // });
// };
