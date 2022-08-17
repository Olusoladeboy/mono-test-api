import * as express from 'express';
import User from './components/user/user.controller';

export default function registerRoutes(app: express.Application): void {
    // new SystemStatusController(app);
    new User(app);
}
