// import { Request, Response } from 'express';
// import { findInRelatedToArray } from '../../utils/findInRelatedToArray';

// export const deleteQuestionFromOrg = async (req: Request, res: Response) => {
//   const { user } = req;
//   return res.status(200).json({ message: 'Endpoint temp disabled' });

//   // const orgId = findInRelatedToArray({ entity: IdxTypes.Org, targetArray: user.target });
//   // const [success, failure] = await DB.Questions.deleteQuestionFromOrg({
//   //   orgId: orgId,
//   //   questionId: req.params.questionId,
//   //   updateOrg: true,
//   // });

//   // if (failure) {
//   //   if (failure.name === 'TransactionCanceledException') {
//   //     return res.status(404).json({ message: 'It seems like that question no longer exists' });
//   //   }

//   //   const { status, body } = CreateError.SDK(failure, 'An error ocurred deleting that question');
//   //   return res.status(status).json(body);
//   // }

//   // return res.status(200).json({ message: 'Question deleted!' });
// };
