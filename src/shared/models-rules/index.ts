import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  const testUserId = '0352d07a-5c89-45bc-ad75-17157e24604a';
  return request.user ? request.user.id : testUserId;
}
