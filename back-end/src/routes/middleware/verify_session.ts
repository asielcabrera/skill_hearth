import { Request, Response, NextFunction } from 'express';
import { ENV } from '../../config/env';
import { logger } from '../../utils/logger';
import { CONSTANTS } from '../../utils/constants';

const returnStatusOrNext = ({
    res,
    status,
    data,
    next
}: {
    res: Response;
    status?: number;
    data?: any;
    next?: NextFunction;
}) => {
    if (next) {
        return next();
    };

    if (data) {
        res.status(status!).json(data);
    } else {
        res.sendStatus(status!);
    };
};

export const verify_session = async (
    req: Request,
    res: Response,
    next?: NextFunction
): Promise<void> => {
    logger.info('Entered verifySession API endpoint...');

    try {
        if (ENV.ENV_MODE === 'development' && req.cookies.admin_cookie) {
            logger.info(req.cookies.admin_cookie);
            return returnStatusOrNext({ res, status: 200, data: req.cookies.admin_cookie, next });
        }

        const userSession = req.session.user;

        console.log(userSession);

        if (!userSession) {
            logger.info('User does not have a session...');
            return returnStatusOrNext({ res, status: 204, next });
        }

        if (!userSession.onboarded) {
            logger.info('User has not been onboarded...');
            return returnStatusOrNext({
                res,
                status: 200,
                data: {
                    user: { name: userSession.name },
                    onboarded: { status: userSession.onboarded }
                },
                next
            });
        }

        return returnStatusOrNext({
            res,
            status: 200,
            data: { user: { name: userSession.name } },
            next
        });
    } catch (err) {
        logger.error(
            `${CONSTANTS.ERRORS.PREFIX.VERIFY_SESSION + CONSTANTS.ERRORS.CATASTROPHIC}: ${err}`
        );
        return returnStatusOrNext({ res, status: 500, next });
    }
};
